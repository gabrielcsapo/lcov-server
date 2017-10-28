const { name, description } = require('./package.json');

module.exports = {
	title: name,
	description: description,
	icon: '',
	demoImage: './example.png',
	links: {
		Source: 'https://github.com/gabrielcsapo/lcov-server',
		Download: 'https://github.com/gabrielcsapo/lcov-server/releases',
		Docs: './code/index.html',
		Storybook: './storybook/index.html',
		Example: 'http://lcov-server.gabrielcsapo.com'
	}
};
