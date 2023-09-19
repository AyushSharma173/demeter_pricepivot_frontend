const fs=require("fs")

const questions=fs.readdirSync(".").filter(x=>fs.lstatSync(x).isDirectory())

const imports=[]
const iconMap={}
const iconMapS=
questions.forEach(question=>{

    let icons=fs.readdirSync(question)

    icons.forEach(icon=>{
        const name=icon.split(".")[0]
        imports.push(`import ${question}_${name} from "${question}/${icon}"`)
        iconMap[question]=iconMap[question] || {}
        iconMap[question][name]="_"+`${question}_${name}`+'_'
    })


})


const out=imports.join("\n")+"\nconst questionMap="+JSON.stringify(iconMap,null,4).replace(/\"_/g,"").replace(/_\"/g,"")+"\nexport default questionMap"
fs.writeFileSync("index.ts",out)