

fis.match('*.scss', {
    rExt: '.css',
    parser: fis.plugin('sass', {}),
    postprocessor: fis.plugin('autoprefixer', {
        // browsers: ['> 1% in CN', "last 2 versions", "IE >= 8"] // pc
        browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6"] // wap
    }

    )
});

fis.match('*.jade', {
  rExt: '.html',
  loaderLang: 'html',
  parser: fis.plugin('jade', {
    pretty  : true
  })
});


fis.match('/app/js/**.js', {
  isMod: true
})

// fis.match('**.es', {
//     parser: fis.plugin('babel-5.x', {
//         sourceMaps: true
//     }),
//     rExt: 'js'
// });

fis.set('project.fileType.text', 'es');
fis.match('*.es', {
    rExt: '.js',
    parser: fis.plugin('es6-babel', {})
});

fis.media('prod')
    .match('/app/abc/*', {
        release: './../tempwww/Web/$0',
        url: "$0"
    })
    .match('/*.jade', {
        release: './../tempwww/Web/Views/default/activity/match/$0'

    })
    .match('*.scss', {
            optimizer: fis.plugin('clean-css')
        })
        .match('*.png', {
            optimizer: fis.plugin('png-compressor', {

                // pngcrush or pngquant
                // default is pngcrush
                type: 'pngquant'
            })
        })
        .match('*.js', {
            optimizer: fis.plugin('uglify-js', {})
        });









// fis.hook('amd'{
//   baseUrl: './modules',
//   paths: {
//     $: 'jquery/jquery-1.11.2.js'
//   }
// })

// fis.hook('relative'); 
 
// fis.match('**', { relative: true })

// fis.match('::package', {
//     postpackager: fis.plugin('loader', {
//         resourceType: 'commonJs',
//         useInlineMap: true // 资源映射表内嵌
//     })
// })

// fis.match('::packager', {
//   postpackager: fis.plugin('loader', {
//     allInOne: true
//   })
// });

// fis.match('*.{css,scss}', {
//   optimizer: fis.plugin('clean-css')
// });


// fis.match('*.js', {
//   optimizer: fis.plugin('uglify-js')
// });