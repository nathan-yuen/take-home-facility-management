const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  builders: {
    web: {
      webpackConfig: {
        plugins: [
          new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'template.html'),
            title: 'YO'
          })
        ]
      }
    }
  }
};