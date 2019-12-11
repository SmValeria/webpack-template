const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const devDir = 'app';
const buildDir = 'docs';

const pagesDir = path.resolve(__dirname, `./${devDir}/pug/pages/`);
const pages = fs.readdirSync(pagesDir).filter(fileName => fileName.endsWith('.pug'));

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  let cssUseList = []; // Организуем список loader-ов для картинок и css таким образом
  let imagesUseList = []; // поскольку они отличаются от режима разработки

  if (isProduction) {

    cssUseList.push(
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../../', // Чтобы подключались шрифты
          },
        },
        'css-loader',
        {
          loader: 'clean-css-loader',
          options: {
            level: 2,
          }
        },
        'postcss-loader'
    );

    imagesUseList.push(
        {
          loader: 'file-loader',
          options: {
            name: 'assets/images/[hash].[ext]'
          }
        },
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 65
            },
            optipng: {
              enabled: false,
            },
            pngquant: {
              quality: [0.65, 0.80],
              speed: 4
            },
            gifsicle: {
              interlaced: false,
            }
          },
        }
    );
  } else {

    cssUseList.push(
        'style-loader',
        {
          loader: 'css-loader',
          options: {sourceMap: true},
        },
        {
          loader: 'postcss-loader',
          options: {sourceMap: true},
        }
    );

    imagesUseList.push(
        {
          loader: 'file-loader',
          options: {
            name: 'assets/images/[hash].[ext]'
          }
        }
    );
  }

  const js = {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: '/node_modules/',
  };

  const pcss = {
    test: /\.(p|post|)css$/,
    use: cssUseList
  };

  const pug = {
    test: /\.pug$/,
    loader: 'pug-loader',
  };

  const images = {
    test: /\.(png|jpe?g|gif)$/i,
    use: imagesUseList
  };

  const fonts = {
    test: /\.(woff(2)?)$/i,
    loaders: 'file-loader',
    options: {
      name: 'assets/fonts/[name].[ext]'
    }
  };

  const svg = {
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: svgPath => `assets/images/sprite${svgPath.substr(-4)}`
        }
      },
      'svg-transform-loader',
      {
        loader: 'svgo-loader',
        options: {
          plugins: [
            {removeTitle: true},
            {
              removeAttrs: {
                attrs: '(fill|stroke)'
              }
            }
          ]
        }
      }
    ]
  };

  const configTemplate = {
    entry: WebpackWatchedGlobEntries.getEntries(
        [
          path.resolve(__dirname, `${devDir}/*.js`)
        ],
    ),
    output: {
      filename: 'js/[name].[hash].js',
      chunkFilename: 'js/[id].[chunkhash].js',
      path: path.resolve(__dirname, `./${buildDir}`)
    },
    module: {
      rules: [js, pcss, pug, svg, images, fonts]
    },
    resolve: {
      extensions: ['*', '.js', '.json'],
      alias: {
        images: path.resolve(__dirname, `${devDir}/assets/images`),
        fonts: path.resolve(__dirname, `${devDir}/assets/fonts`)
      },
    },
    devServer: {
      noInfo: false,
      overlay: true,
    },
    plugins: [
      new WebpackWatchedGlobEntries(),
      new SpriteLoaderPlugin({plainSprite: true}),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'assets/css/main.[contenthash].css' : 'assets/css/main.css',
        chunkFilename: isProduction ? 'assets/css/[id].[contenthash].css' : 'assets/css/[id].css',
      }),
      ...pages.map(page => new HtmlWebpackPlugin({
        favicon: `${devDir}/assets/images/content/favicon.png`,
        hash: true,
        chunks: [page.replace(/\.pug/, '')],
        template: `${pagesDir}/${page}`,
        filename: `${page.replace(/\.pug/, '.html')}`
      })),
    ],
    optimization: {
      runtimeChunk: !isProduction, // нужно в режиме разработки для корректной работы hot-reload
      splitChunks: {
        chunks: 'all',
      },
    },
    devtool: isProduction ? 'none' : 'cheap-module-source-map',
  };

  if (isProduction) {

    configTemplate.plugins = (configTemplate.plugins || []).concat([
      new CleanWebpackPlugin()
    ]);
    configTemplate.optimization.minimize = true;
    configTemplate.optimization.minimizer = [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true,
        parallel: true,
        sourceMap: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin({})
    ];
  }
  return configTemplate;
};