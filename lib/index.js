const path = require('path')
const fs = require('fs')
const encoding = 'utf-8'

const [,,...args] = process.argv
const arguments = {
    name: args[0],
}
for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith("--")) {
        const [key, value = true] = args[i].substring(2).split("=")
        if (key) {
            arguments[key] = value
        }
    }
    else if (args[i].startsWith("-")) {
        Array.from(args[i].substring(1)).forEach((flag) => {
            arguments[flag] = true
        })
    }
}
const templates = ['vue2', 'vue3', 'react']
const options = {
    template: 'vue3',
    ...arguments,
}
if (templates.includes(options.template)) {
    const {
        name,
        template,
    } = options
    const destination = path.resolve(process.cwd(), name)
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination)
    }
    const commonPackageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./templates/common/package.json`), {
        encoding,
    }))
    const templatePackageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./templates/${template}/package.json`), {
        encoding,
    }))
    const devDependencies = {
        ...commonPackageJson.devDependencies,
        ...templatePackageJson.devDependencies,
    }
    const dependencies = {
        ...commonPackageJson.dependencies,
        ...templatePackageJson.dependencies,
    }
    const packageJson = {
        name,
        version: '1.0.0',
        description: '',
        main: 'index.js',
        author: '',
        keywords: [],
        scripts: {
            dev: "vite",
            build: "vite build",
        },
        license: 'ISC',
        devDependencies,
        dependencies,
    }
    fs.writeFileSync(path.resolve(destination, 'package.json'), JSON.stringify(packageJson, null, "  "), {
        encoding,
    })
    const copyDir = (src, dest) => {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest)
        }
        (function copy(src, dest) {
            fs.readdirSync(src, {
                withFileTypes: true,
            }).forEach((dir) => {
                const srcPath = path.resolve(src, dir.name)
                const destPath = path.resolve(dest, dir.name)
                if (dir.isDirectory()) {
                    if (!fs.existsSync(destPath)) {
                        fs.mkdirSync(destPath)
                    }
                    copy(srcPath, destPath)
                }
                else {
                    fs.copyFileSync(srcPath, destPath)
                }
            })
        })(src, dest)
    }
    copyDir(path.resolve(__dirname, './templates/common/files'), destination)
    copyDir(path.resolve(__dirname, `./templates/${template}/files`), destination)
}
