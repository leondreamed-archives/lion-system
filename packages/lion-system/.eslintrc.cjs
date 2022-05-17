const createESLintConfig = require('lionconfig');

console.log(
	JSON.stringify(
		createESLintConfig(__dirname, {
			rules: {
				'unicorn/no-process-exit': 'off',
			},
		}),
		null,
		2
	)
);

module.exports = createESLintConfig(__dirname, {
	rules: {
		'unicorn/no-process-exit': 'off',
	},
});
