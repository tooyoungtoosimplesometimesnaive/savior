const http = require('http')
const https = require('https')
const fs = require('fs')
const cheerio = require('cheerio')
const Stream = require('stream').Transform

console.log(process.argv)

const url = process.argv[2]
function getClient(url) {
	return url.startsWith('https://') ? https : http
}

function getFullUrl(url) {
	return url.startsWith('//') ? 'http:' + url : url
}

let dir = 'img_outs/'
let n = 'a'

const client = getClient(url)

client.get(url, (res) => {
	const { statusCode, headers } = res
	console.log(statusCode)
	console.log(headers)

	res.setEncoding('utf8')
	let rawData = '';
	res.on('data', (chunk) => { rawData += chunk })
	res.on('end', () => {
		// console.log(rawData)
		fs.writeFileSync('the_out_file_2.f', rawData)

		const $ = cheerio.load(rawData)
		const imgs = $('img')
		console.log(imgs)
		imgs.each( (index, e) => {
			if (!e.attribs.src) {
				return
			}
			console.log(e.attribs.src)
			console.log(index)
			const imgUrl = getFullUrl(e.attribs.src)
			console.log(imgUrl)
			getImg(imgUrl, getClient(imgUrl), dir + n + '.jpg')
			n += 'a'
		})
		
	})
}).on('error', (e) => {
	console.log(e)
})


function getImg(url, client, name) {
	client.get(url, (res) => {
		const { statusCode, headers } = res
		console.log(statusCode)
		console.log(headers)

		let data = new Stream()
		res.on('data', (chunk) => {
			data.push(chunk)
		})
		res.on('end', () => {
			fs.writeFileSync(name, data.read())
		})
	}).end()
}


