packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}


source "amazon-ebs" "ubuntu" {
  ami_name      = "learn-packer-linux-aws"
  instance_type = "t2.micro"
  region        = "us-east-1"
  source_ami_filter {
    filters = {
      name                = "ubuntu/images/*ubuntu-xenial-16.04-amd64-server-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"]

  }
  ssh_username = "ubuntu"
}

build {
  name = "New-learn-packer"
  sources = [
    "source.amazon-ebs.ubuntu"
  ]

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    inline = [
      "echo Installing Software",
      "sleep 30",
      "sudo apt-get update",
      "sudo apt-get install -y curl",
      "sudo apt-get install zip unzip",
      // "sudo apt-get -y install postgresql",
      "sudo curl -o /root/amazon-cloudwatch-agent.deb https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb",
      "sudo dpkg -i -E /root/amazon-cloudwatch-agent.deb",
      "curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -",
      "sudo apt-get install -y nodejs",
      "sudo npm install -g pm2",
      "mkdir -p ~/Application/",
      "mv /tmp/webapp.zip ~/Application/",
      "cd ~/Application",
      "unzip webapp.zip -d webapp",
      "cd webapp",
      "ls",
      "npm install",
      "sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/home/ubuntu/Application/webapp/Config/CloudWatchAgent.json",
      // "sudo -u postgres psql  -c \"ALTER USER postgres PASSWORD 'admin'\"",
      // "sudo pm2 start ./Models/document.js",
      // "sudo pm2 start ./Models/user.js",
      // "sudo pm2 start index.js",
      // "sudo pm2 startup systemd",
      // "sudo pm2 save",
      // "sudo pm2 list"

    ]
  }
}




