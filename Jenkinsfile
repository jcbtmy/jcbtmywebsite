pipeline{
    
    environment {
        imagename = "jcbtmywebsite:latest"
    }
    
    
    agent any
    
    stages{
       
        stage('Build'){
         
            steps{
                
                echo "-->Building Front End<----"

                sh "mkdir backend/wwwroot"
                
                 //build compile front end src
                dir("frontend"){

                    sh "npm install"
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