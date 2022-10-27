packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "amazon-ebs" "ubuntu" {
  ami_name      = "learn-packer-linux-aws-2"
  instance_type = "t2.micro"
  region        = "us-east-1"
  source_ami_filter {
    filters = {
      name                = "ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-20220912"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"]
  }
  ssh_username = "ubuntu"
}

build {
  name = "learn-packer"
  sources = [
    "source.amazon-ebs.ubuntu"
  ]

  provisioner "file" {
    source      = "./webapp.tar"
    destination = "/tmp/webapp.tar"
  }

  provisioner "shell" {
    inline = [
      "echo Installing postgres",
      "sleep 30",
      "sudo apt-get update",
      "sudo apt-get install -y curl",
      "sudo apt-get -y install postgresql",
      "curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -",
      "sudo apt-get install -y nodejs",
      "sudo npm install -g pm2",
      "mkdir -p ~/Application/",
      "mv /tmp/webapp.tar ~/Application/",
      "cd ~/Application",
      "tar -xvf webapp.tar",
      "cd webapp",
      "npm install",
      "sudo -u postgres psql  -c \"ALTER USER postgres PASSWORD 'admin'\"",
      "sudo pm2 start ./Models/user.js",
      "sudo pm2 start index.js",
      "sudo pm2 startup systemd",
      "sudo pm2 save",
      "sudo pm2 list"

    ]
  }
}




