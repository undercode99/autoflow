package lib

import (
	"fmt"
	"time"
	"testing"
	"github.com/appleboy/easyssh-proxy"
)

func TestSsh(t *testing.T) {
	// Create MakeConfig instance with remote username, server address and path to private key.
	ssh := &MakeConfig{
		User:   "xxx",
		Server: "localhost",
		// Optional key or Password without either we try to contact your agent SOCKET
		Password: "U5m@n4521",
		// Paste your source content of private key
		// Key: `-----BEGIN RSA PRIVATE KEY-----
		// MIIEpAIBAAKCAQEA4e2D/qPN08pzTac+a8ZmlP1ziJOXk45CynMPtva0rtK/RB26
		// 7XC9wlRna4b3Ln8ew3q1ZcBjXwD4ppbTlmwAfQIaZTGJUgQbdsO9YA==
		// -----END RSA PRIVATE KEY-----
		// `,
		// KeyPath: "/Users/username/.ssh/id_rsa",
		Port:    "22",
		Timeout: 60 * time.Second,

		// Parse PrivateKey With Passphrase
		// Passphrase: "1234",

		// Optional fingerprint SHA256 verification
		// Get Fingerprint: ssh.FingerprintSHA256(key)
		// Fingerprint: "SHA256:mVPwvezndPv/ARoIadVY98vAC0g+P/5633yTC4d/wXE"

		// Enable the use of insecure ciphers and key exchange methods.
		// This enables the use of the the following insecure ciphers and key exchange methods:
		// - aes128-cbc
		// - aes192-cbc
		// - aes256-cbc
		// - 3des-cbc
		// - diffie-hellman-group-exchange-sha256
		// - diffie-hellman-group-exchange-sha1
		// Those algorithms are insecure and may allow plaintext data to be recovered by an attacker.
		// UseInsecureCipher: true,
	}

	// Call Run method with command you want to run on remote server.
	stdout, stderr, done, err := ssh.Run("/home/xxx/anaconda3/envs/levelup/bin/python /home/xxx/test_run.py", 60*time.Second)
	// Handle errors
	if err != nil {
		panic("Can't run remote command: " + err.Error())
	} else {
		fmt.Println("don is :", done, "stdout is :", stdout, ";   stderr is :", stderr)
	}
}


func TestLogStream(t *testing.T) {
	// Create MakeConfig instance with remote username, server address and path to private key.
	ssh := &easyssh.MakeConfig{
		Server:  "localhost",
		User:    "xxx",
		Password: "U5m@n4521",
		Port:    "22",
		Timeout: 760 * time.Second,
	}


	// Call Run method with command you want to run on remote server.
	stdoutChan, stderrChan, doneChan, errChan, err := ssh.Stream("python3 test_run.py", 60*time.Second)
	// Handle errors
	if err != nil {
		panic("Can't run remote command: " + err.Error())
	} else {
		// read from the output channel until the done signal is passed
		isTimeout := true
	loop:
		for {
			select {
			case isTimeout = <-doneChan:
				break loop
			case outline := <-stdoutChan:
				fmt.Println("stdout:", outline)
			case errline := <-stderrChan:
				fmt.Println("stderr:", errline)
			case err = <-errChan:
			}
		}

		// get exit code or command error.
		if err != nil {
			fmt.Println("err: " + err.Error())
		}

		// command time out
		if !isTimeout {
			fmt.Println("Error: command timeout")
		}
	}
}