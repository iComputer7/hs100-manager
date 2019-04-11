/**
 * TP-LINK API BACKEND
 * by iComputer7 on May 6, 2018 + May 7, 2018
 * 
 * Can turn on/off a TP-Link HS-100
 * 
 * Intended as an API for a frontend
 * 
 * 
 * 
 * NOTES:
 * 
 * parsed URL:
 * http://localhost:8080/on?ip=192.168.69.69
 * {"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":"?ip=192.168.69.69","query":{"ip":"192.168.69.69"},"pathname":"/on","path":"/on?ip=192.168.69.69","href":"/on?ip=192.168.69.69"}
 **/
var http = require('http');
var url = require('url');
var client = require("tplink-smarthome-api");
var client = new client.Client();


http.createServer(function (req, res) { //make an http server
	
	res.writeHead(200, {'Content-Type': 'application/json'}); //generate http 200 response
	let query = url.parse(req.url, true);
	
	if (query.query.ip) { //checking for IP address
		console.log("Initiating connection with " + query.query.ip);
		
		let plug = client.getDevice({host: query.query.ip}).then((device) => {
			//connecting to plug
			console.log(`Initiated connection with ${device.name} at ${query.query.ip}`);
			if (query.pathname == "/on") {
				device.setPowerState(true); //turning on plug
				console.log(`Turned on ${device.name}`);
				res.write(JSON.stringify({
					error: false,
					plugOn: true
				}));
				return res.end(); //closes http response
			} else if (query.pathname == "/off") {
				device.setPowerState(false); //turning off plug
				console.log(`Turned off ${device.name}`);
				res.write(JSON.stringify({
					error: false,
					plugOn: false
				}));
				return res.end(); //closes http response
			} else if (query.pathname == "/status") {
				device.getPowerState().then((s) => {
					console.log(`Checked state of ${device.name}, state: ${s}`);
					res.write(JSON.stringify({
						error: false,
						plugOn: s
					}));
					return res.end(); //closes http response
				});
			} else {
				res.write(JSON.stringify({
					error: true,
					errorDetails: {
						ipSpecified:true,
						ipInvalid: false,
						commandInvalid: true
					}
				}));
				return res.end(); //closes http response
			}
		
		}).catch((e) => { //invalid IP
			res.write (JSON.stringify({
				error: true,
				errorDetails: {
					ipSpecified: true,
					ipInvalid: true,
					commandInvalid: true
				}
			}));
			return res.end(); //closes http response
		});
	} else {
		res.write(JSON.stringify({
			error: true,
			errorDetails: {
				ipSpecified: false,
				ipInvalid: true,
				commandInvalid: true
			}
		}));
		return res.end(); //closes http response
	}
}).listen(8080); //listens on port 8080

console.log("HS-100 MANAGER BACKEND STARTED");
