import path from 'node:path'

export function absolutePathFunc(dir) {
  
    const absPathToResource =  path.join(dir, 'public', 'index.html')
    console.log('\nabsolute path to resource:', absPathToResource)

}


export function relativePathFunc() {
  
    const absPathToResource =  path.join('public', 'index.html')
    console.log('\nrelative path to resource:', absPathToResource)

}


