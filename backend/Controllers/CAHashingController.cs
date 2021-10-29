using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using System.IO;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using System.Drawing;
using System.Drawing.Imaging;


using CAHashingApi.Models;
using CAHashingApi.Services;



namespace ProjectSite.Controllers 
{

    [ApiController]
    [Route("api/[controller]")]

    public class CAHashingController : ControllerBase
    {
        private readonly CAHashService _caHashingService;


        string createImage (int[][] map, int rows, int cols)
        {
            Bitmap image = new Bitmap(cols, rows);
            
            //every row in the bitmap, color black if the automata cell is 1 else color white
            for(int i = 0; i < rows; i++) 
            {
                for(int j = 0; j < cols; j++)
                {
                    byte R;
                    byte G;
                    byte B;

                    if(map[i][j] == 1)
                    {
                        R = (byte)0;
                        G = (byte)0;
                        B = (byte)0;
                    }
                    else{
                        R = (byte)255;
                        G = (byte)255;
                        B = (byte)255;
                    }
                    Color pixelColor = Color.FromArgb(R, G,B);

                    image.SetPixel(j,i, pixelColor);
                }
            }

            using (MemoryStream ms = new MemoryStream())
            {
                    // Convert Image to byte[]
                image.Save(ms, ImageFormat.Png);
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to Base64 String
                return Convert.ToBase64String(imageBytes);
            }
        }

        int[] stringToBitArray(string input)
        {
            int num;
            int bitIndexValue;
            int position = 0;
            int[] bitArray = new int[8 * input.Length];

            foreach(var character in input)
            {
                num = Convert.ToInt32(character);
                //get positon of bit based on value of char
                for(int i = 7; i >= 0; i--)
                {
                    bitIndexValue = (int)Math.Pow((double)2, (double)i);

                    if( (num - bitIndexValue) >= 0 )
                    {
                        bitArray[ (position*8) + i ] = 1;
                        num -= bitIndexValue;
                    }
                }
                position++;
            }

            return bitArray;

        }

        string bitArrayToHexString(int[] array)
        {   
            string hashString = "";

            for(int i = 0; i < array.Length; i += 8)
            {
                int num = 0;

                //get the char value based on bit position, add to string
                for(int j = 0; j < 8; j++)
                {
                    if(array[i + j] == 1) 
                    {
                        num += (int)Math.Pow((double)2, (double) j);
                    }
                }

                hashString += Convert.ToChar(num);
            }

            byte[] bytes = Encoding.UTF8.GetBytes(hashString);

            string hexString = Convert.ToHexString(bytes);

            return hexString;
        }
    
        public CAHashingController(CAHashService service)
        {
            _caHashingService = service;
        }

        [HttpGet("{id:length(24)}", Name="GetHash")]
        public async Task<ActionResult<CAHash>> GetHash(string id)
        {
            CAHash hash = await _caHashingService.GetHashById(id);

            if(hash is null)
            {
                return NotFound();
            }

            return hash;
        }


        [HttpPost]
        public async Task<ActionResult<CAHash>> CreateHash(CAHash hash)
        {   
            CAHash duplicate = await _caHashingService.GetHashDuplicate(hash.input, hash.ruleNumber, hash.iterations);

            if(duplicate is not null)
            {
                return StatusCode(409);
            }

            await _caHashingService.CreateHash(hash);

            return CreatedAtRoute("GetHash", new {id = hash.Id.ToString()}, hash);
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<CAHash>>> GetCAHash(string input, uint iterations)
        {
            if(  input == null || input.Length == 0|| input.Length > 256 || iterations == 0 )
                return BadRequest();


            List<CAHash> allRuleHashes = new List<CAHash>();
            List<CARule> rules = await _caHashingService.GetAllRules();

            if(rules.Count == 0)
                return StatusCode(500);


            int[] state = stringToBitArray(input);
            int initialStateLength = state.Length;

            const int colWidth = 256;

            foreach( var rule in rules){

                CAHash newHash = new CAHash();

                newHash.iterations = iterations;
                newHash.input = input;
                newHash.ruleNumber = rule.ruleNumber;

                int [][] newData = new int[iterations][]; 

                newData[0] = new int[colWidth];

                for(int i = 0; i < initialStateLength; i++)
                {
                    newData[0][i + 1] = state[i]; //fill inital state of data before iterations
                }

                for(int i = 1; i < iterations; i++)
                {
                    //create next row of automata
                    newData[i] = new int[colWidth];

                    for(int j = 0; j < colWidth; j++)
                    {   
                        //get previous row neighbors
                        int top = newData[i - 1][j];
                        int topRight = (j + 1 ) < colWidth ? newData[i - 1][j + 1] : 0;
                        int topLeft = (j - 1) >= 0 ? newData[i - 1][j - 1] : 0;

                        foreach(var r in rule.ruleSet) //check the state against all rules in a ruleset
                        {
                            if( (top == r[CARule.TOP]) && (topRight == r[CARule.RIGHT]) && (topLeft == r[CARule.LEFT]))
                            {
                                newData[i][j] = r[CARule.CENTER];
                            }
                        }
                    }
                }

                int[] finalstate = new int[colWidth];

                for(int i = 0; i < colWidth; i++)
                {
                    finalstate[i] = newData[iterations - 1][i];
                }

                newHash.outputHash = bitArrayToHexString(finalstate); //create outpush hash from bitarray 
                newHash.imageData = createImage(newData, (int)iterations, colWidth); //create image

                allRuleHashes.Add(newHash); 
            }
           
            return allRuleHashes;

        }

        [HttpGet("Rule")]
        public async Task<ActionResult<IEnumerable<CARule>>> GetRules()
        {
            List<CARule> rules = await _caHashingService.GetAllRules();
            
            return rules;
        }

        [HttpGet("Rule/{id:length(24)}", Name="GetRule")]
        public async Task<ActionResult<CARule>> GetRule(string id)
        {
            CARule rule = await _caHashingService.GetRuleById(id); 

            if(rule is null)
            {
                return NotFound();
            }

            return rule;
        }

        [HttpPost("CreateRule")]
        public async Task<ActionResult<CARule>> CreateRule(CARule rule)
        {
            if(rule == null)
                return BadRequest();

            CARule duplicate = await _caHashingService.GetRuleByNumber(rule.ruleNumber);
            
            if(duplicate is not null)
            {
                return StatusCode(409);
            }

            await _caHashingService.CreateRule(rule);

            return CreatedAtRoute("GetRule", new {id = rule.Id.ToString()}, rule);
        }
    }
}