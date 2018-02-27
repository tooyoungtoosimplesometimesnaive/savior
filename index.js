function walk(root) {
	if (root.children()) {
		for (var i = 0; i < root.children().length; i++) {
			const child = root.children()[i]
			// console.log(child)
			console.log(child.text())
			walk(child)
		}
	}
}
const http = require('http')
const https = require('https')
const fs = require('fs')
const cheerio = require('cheerio')

console.log(process.argv)

let client

const url = process.argv[2]
if (url.startsWith('https://')) {
	client = https
} else {
	client = http
}

client.get(url, (res) => {
	const { statusCode, headers } = res
	console.log(statusCode)
	console.log(headers)
	// console.log(res)
	// console.log(res.body)

	res.setEncoding('utf8')
	let rawData = '';
	res.on('data', (chunk) => { rawData += chunk })
	res.on('end', () => {
		// console.log(rawData)
		const $ = cheerio.load(rawData)
		console.log($('html'))
		walk($.root())
		/*
		$('*').each((index, e) => {
			console.log(index)
			console.log(e)
			console.log($(this).text())
		})
		*/
		fs.writeFileSync('the_out_file.f', rawData)
	})
}).on('error', (e) => {
	console.log(e)
})

