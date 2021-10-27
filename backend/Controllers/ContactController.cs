using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Text;
using System.IO;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


using Contact.Models;



namespace ProjectSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ContactController : ControllerBase
    {
        private readonly SmtpClient smtpClient;

        public ContactController(){
            smtpClient = new SmtpClient();
        }

        [HttpPost]
        public IActionResult SendEmail(ContactMessage contactMessage)
        {

            
            string loginName = Environment.GetEnvironmentVariable("EMAIL_USERNAME");
            string password = Environment.GetEnvironmentVariable("EMAIL_PASS");


            MailAddress to = new MailAddress("jcbtmy@gmail.com");
            MailAddress from = new MailAddress("jcbtmyawswebsite@gmail.com");

            MailMessage message = new MailMessage(from, to);

            message.Subject = contactMessage.subject;
            message.Body = $"{contactMessage.message}\n{contactMessage.name}\n{contactMessage.contact}";
            message.SubjectEncoding = System.Text.Encoding.UTF8;

            SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(loginName, password),
                EnableSsl = true,
                UseDefaultCredentials = false,
            };

            try
            {
                client.Send(message);
                return Ok();
            }
            catch (SmtpException ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500);
            }
                        

        }
    }


}