function toAppleScheme(color) {

    color       = color.slice(1)
    
    let baseSlice=(s,e)=>parseInt(color.slice(s,e),16)/255

    let red     = baseSlice(0, 2)
    let green   = baseSlice(2, 4)
    let blue    = baseSlice(4,6)

    console.log(`red="${red}" green="${green}" blue="${blue}" `)

}

function toRGB(color) {

    color       = color.slice(1)
    
    let baseSlice=(s,e)=>parseInt(color.slice(s,e),16)

    let red     = baseSlice(0, 2)
    let green   = baseSlice(2, 4)
    let blue    = baseSlice(4,6)

    console.log(`red="${red}" green="${green}" blue="${blue}" `)

}
function toHex(r,g,b){

    r=r.toString(16)
    g=g.toString(16)
    b=b.toString(16)

    console.log(r,g,b)
}