# SSAFY E206 Porting Manual

# 목차

- [SSAFY E206 Porting Manual](#ssafy-e206-porting-manual)
- [목차](#목차)
- [개발 및 배포 환경](#개발-및-배포-환경)
  - [프론트엔드](#프론트엔드)
  - [백엔드](#백엔드)
  - [Web RTC](#web-rtc)
- [배포 및 빌드](#배포-및-빌드)
  - [환경 변수](#환경-변수)
    - [MySQL 설정](#mysql-설정)
    - [MySQL스키마 설정](#mysql스키마-설정)
    - [Redis 설정](#redis-설정)
    - [openvidu 설정](#openvidu-설정)
  - [EC2 ufw 설정 및 포트 개방](#ec2-ufw-설정-및-포트-개방)
    - [openVidu port](#openvidu-port)
    - [그 외 사용 port](#그-외-사용-port)
    - [EC2에 Docker 설치](#ec2에-docker-설치)
    - [EC2에 NGINX 설치 및 설정](#ec2에-nginx-설치-및-설정)
    - [Docker 컨테이너에서 Jenkins 실행](#docker-컨테이너에서-jenkins-실행)
    - [Docker 컨테이너에서 Openvidu 실행](#docker-컨테이너에서-openvidu-실행)

# 개발 및 배포 환경

## 프론트엔드

- VS CODE 1.85.1
- Vite 5.0.8
- React 18.2.0
- JavaScript ES6+
- Node.js 20.11.0
- tailwindcss 3.4.1

## 백엔드

- IntelliJ 2023.3.2
- Oracle OpenJDK 17.0.10
- Spring Boot 3.2.1
- MySQL 8.0.35
- redis 7.2.4

## Web RTC

- openvidu 2.29.0

# 배포 및 빌드

## 환경 변수

### MySQL 설정

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver\
spring.datasource.url=jdbc:mysql://[도메인]:3306/eyebird?serverTimezone=Asia/Seoul\
spring.datasource.username=root\
spring.datasource.password=[비밀번호]\
spring.jpa.properties.hibernate.show_sql=true\
spring.jpa.properties.hibernate.format_sql=true\
spring.jpa.hibernate.ddl-auto=create\
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

### MySQL스키마 설정

CREATE DATABASE eyebird;\
USE eyebird;

### Redis 설정

spring.data.redis.host=[도메인]\
spring.data.redis.port=6379\
spring.data.redis.password=[비밀번호]

### openvidu 설정

OPENVIDU_URL: https://[도메인]:8443\
OPENVIDU_SECRET: [비밀번호]

## EC2 ufw 설정 및 포트 개방

### openVidu port

- 22 TCP: to connect using SSH to admin OpenVidu.
- 80 TCP: if you select Let's Encrypt to generate an SSL certificate this port is used by the generation process.
- 443 TCP: OpenVidu server and application are published by default in standard https port.
- 3478 TCP+UDP: used by TURN server to resolve clients IPs.
- 40000 - 57000 TCP+UDP: used by Kurento Media Server to establish media connections.
- 57001 - 65535 TCP+UDP: used by TURN server to establish relayed media connections.

### 그 외 사용 port

- 80 : 리버스 프록시 nginx http
- 443 : 리버스 프록시 nginx https
- 3306 : MySQL
- 6379 : redis
- 8787 : spring boot
- 8080 : Jenkins

### EC2에 Docker 설치

```bash
sudo apt update
sudo apt install docker
docker --version
```
### EC2에 NGINX 설치 및 설정

```bash
sudo apt update
sudo apt install nginx
```

1. ZeroSSL 발급
2. Auth파일 서버에 복사
   - root 경로에 /.well-known/pki-validation 디렉토리 생성 후 Auth File 복사
    ``` bash
    scp -i [pem키 경로] [Auth File 경로]\[Auth File 명].txt [SSH 접속 문자열]:[루트 경로]/.well-known/pki-vlaidation
    ```
3. 인증 확인 및 ssl 파일 설치
4. 설치한 파일을 압축 후 서버로 복사
    ```
    scp -i [pem키 경로] [zip 파일 경로] [SSH 접속 문자열]:/etc/nginx/ssl
    ```
5. 압축 해제
    ```
    sudo apt install unzip
    unzip ~~~.zip
    ```
6. nginx.conf 수정
    ```
    # HTTP 서버 설정 - HTTP 요청을 HTTPS로 리디렉션
        server {
                listen          80;
                server_name     [도메인];
                return          301 https://$server_name$request_uri;
        }

        # HTTPS 서버 설정
        server {
                listen          443 ssl;
                server_name     [도메인];

                ssl_certificate         /etc/nginx/ssl/certificate.crt;
                ssl_certificate_key     /etc/nginx/ssl/private.key;


                # Java Application 트래픽 리디렉션
                location /api {
                        proxy_pass      http://localhost:8787;
                        proxy_set_header Upgrade $http_upgrade;
                        proxy_set_header Connection "upgrade";
                }

                # FastAPI Application 트래픽 리디렉션
                location /fastapi {
                        proxy_pass      http://localhost:8000;
                        proxy_set_header Upgrade $http_upgrade;
                        proxy_set_header Connection "upgrade";
                }

                # Node.js Application 트래픽 리디렉션
                location / {
                #       proxy_pass      http://localhost:3000;
                        root    /var/www/html/;
                        index   index.html index.htm;
                        try_files $uri $uri/    /index.html;
                }

                error_page      500 502 503 504         /50x.html;
                location =      /50x.html {
                        root    /usr/share/nginx/html;
                }
        }
    ```

### Docker 컨테이너에서 Jenkins 실행

1. Jenkins 이미지 pull
    ```
    sudo docker pull jenkins/jenkins:lts
    ```
2. 컨테이너 실행
    ```
    sudo docker run -d -u root -v /var/run/docker.sock:/var/run/docker.sock -v /var/data/jenkins_home:/var/jenkins_home -p 8080:8080 --name jenkins jenkins/jenkins:lts
    ```
3. 초기 암호 생성
    ```
    docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
    ```

### Docker 컨테이너에서 Openvidu 실행
1. NGINX 잠시 종료
2. [openvidu 공식 사이트](https://docs.openvidu.io/en/2.29.0/deployment/ce/on-premises/)에서 openvidu 설치
3. ssl인증을 위해 .env파일 수정
    ```
    DOMAIN_OR_PUBLIC_IP=[도메인]
    OPENVIDU_SECRET=[비밀번호]
    CERTIFICATE_TYPE=letsencrypt
    LETSENCRYPT_EMAIL=user@example.com
    ```
4. openvidu 실행 (./openvidu start)
5. .env에서 openvidu 포트 번호 수정
6. openvidu 재시작 (./openvidu restart)
7. NGINX 실행