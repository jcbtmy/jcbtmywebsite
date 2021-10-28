pipeline{
    
    environment {
        
        imagename = "jcbtmywebsite:latest"
    }
    
    
    agent any
    
    stages{
       
        stage('Build'){
         
            steps{
                
                echo "-->Building Front End<----"
                
                 //build compile front end src
                dir("frontend"){
                    
                    sh "./build.sh"
                    
                }

                echo "-->Building Backend End<----"  
                dir("backend"){

                    sh "./build.sh"

                }    
            }
        } 
    }
}