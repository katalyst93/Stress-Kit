'use strict';

const path = require( 'path' );

module.exports = {
	devtool: 'source-map',

	entry: path.resolve( __dirname, 'src', 'index.js' ),

	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'main.js'
	},

	module: {
		rules: [
			{
				test: /\.css$/,
				loaders: ["style-loader", "css-loader"]
			}
		]
	}
};