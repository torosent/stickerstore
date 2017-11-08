podTemplate(label: 'mypod', containers: [
    containerTemplate(name: 'docker', image: 'docker', ttyEnabled: true, command: 'cat')
  ],
  volumes: [
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
  ]) {
    node('mypod') {
        def gitRepo = 'https://github.com/torosent/stickerstore/'
        def dockerRepo = 'torosent'
        def dockerImageName = 'stickerstore'
        def vampDeploymentName = 'stickerstore'
        def vampHost = 'http://vamp:8080'
        def dockerImage

    currentBuild.result = "SUCCESS"

    try {
        stage('Checkout'){
            git url: gitRepo, branch: 'master'
            appVersion = sh (
                script: 'node -p -e "require(\'./package.json\').version"', 
                returnStdout: true
            ).trim()     
        }
        stage('Build Docker image') {
            container('docker') {
                sh  """
                    docker build -t ${dockerRepo}/${dockerImageName} .
                    """
            }
        }
        stage('Push Docker image') {
            container('docker') {
                withCredentials([[$class: 'UsernamePasswordMultiBinding', 
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_HUB_USER', 
                        passwordVariable: 'DOCKER_HUB_PASSWORD']]) {
                            sh """
                            docker push ${dockerRepo}/${dockerImageName}:latest
                            docker push ${dockerRepo}/${dockerImageName}:${appversion}
                            """
                        }
            }
        }
        stage('Deploy to Vamp') {
            sh "curl -X POST --data-binary @vamp_blueprint.yml ${vampHost}/api/v1/blueprints -H 'Content-Type: application/x-yaml'"
            sh "curl -X PUT --data-binary @vamp_blueprint.yml ${vampHost}/api/v1/deployments/simpleservice -H 'Content-Type: application/x-yaml'"
            sh "curl -X PUT --data-binary @gateway.yml ${vampHost}/api/v1/gateways/simpleservice/simpleservice/web -H 'Content-Type: application/x-yaml'"
        }  
    }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}