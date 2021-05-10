const colorDivs=document.querySelectorAll(".color")
const generateBtn=document.querySelector(".generate")
const sliders=document.querySelectorAll('input[type="range"]')
const currentHexes=document.querySelectorAll(".color h2")
let initialColors
const popup=document.querySelector('.copy-container')
const lockButton=document.querySelectorAll('.lock')
const adjustButton = document.querySelectorAll(".adjust")
const closeAdjustments=document.querySelectorAll('.close-adjustment')
const sliderContainers=document.querySelectorAll(".sliders")
let savedPalettes=[]



lockButton.forEach((lock,index)=>{
    lock.addEventListener('click',()=>{
        lock.children[0].classList.toggle('fa-lock-open')
        lock.children[0].classList.toggle("fa-lock")
        colorDivs[index].classList.toggle("locked");
    })
})
generateBtn.addEventListener("click",randomColors)
closeAdjustments.forEach((button,index)=>{
    button.addEventListener('click',()=>{
        closeAdjustmentPanel(index)
    }
    )
})

adjustButton.forEach((button,index)=>{
    button.addEventListener('click', ()=>{
        openAdjustmentPanel(index)
    })
})

sliders.forEach(slider=>{
    slider.addEventListener('input',hslControls)
})

colorDivs.forEach((div,index)=>{
    div.addEventListener('change',()=>{
        updateTextUI(index)
    })
})
currentHexes.forEach(hex=>{
    hex.addEventListener("click",()=>{
        copyToClipboard(hex)
    })
})

popup.addEventListener('transitionend',()=>{
    const popupBox=popup.children[0]
    popup.classList.remove("active")
    popupBox.classList.remove("active")
})


function generateHex(){
    return chroma.random()
}   

function randomColors(){
    initialColors=[]
    colorDivs.forEach((div,index)=>{
        const hexText=div.children[0]
        const randomColor=generateHex()

        if (div.classList.contains("locked")){
            initialColors.push(hexText.innerText)
            return}
        else{initialColors.push(chroma(randomColor).hex())}



        div.style.backgroundColor = randomColor
        hexText.innerText=randomColor

        checkTextContrast(randomColor,hexText)

        const color =chroma(randomColor)
        const sliders=div.querySelectorAll('.sliders input')
        const hue = sliders[0]
        const brightness=sliders[1]
        const saturation=sliders[2]
        
        colorizeSliders(color,hue,brightness,saturation)
        
        
    })
    resetInputs()
    adjustButton.forEach((button, index) => {
        checkTextContrast(initialColors[index], button);
    checkTextContrast(initialColors[index], lockButton[index]);
  });

}

function checkTextContrast(color,text){
    const luminance=chroma(color).luminance()
    if(luminance>0.1){
        text.style.color="black"
        text.style.fontWeight="bold"
    }
   else{
    text.style.color="white"
}}
function colorizeSliders(color,hue,brightness,saturation){
    const noSat=color.set('hsl.s',0)
    const fullSat=color.set('hsl.s',1)
    const scaleSat=chroma.scale([noSat,color,fullSat]) 

    const midBright=color.set("hsl.l",0.5)
    const scaleBrightness=chroma.scale(['black',midBright,"white"])




    saturation.style.backgroundImage=`linear-gradient(to right,${scaleSat(0)},${scaleSat(1)})`
    brightness.style.backgroundImage=`linear-gradient(to right,${scaleBrightness(0)},${scaleBrightness(0.5)},${scaleBrightness(1)})`
    const scaleHue = chroma.scale("Spectral")
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
    }
    
function hslControls(e){

    const index=e.target.getAttribute("data-bright") || e.target.getAttribute("data-hue") ||e.target.getAttribute("data-sat") 
    let sliders=e.target.parentElement.querySelectorAll('input[type="range"]')
    const hue=sliders[0]
    const brightness=sliders[1]
    const saturation=sliders[2]
    const bgColor=initialColors[index]
    let color=chroma(bgColor)
    .set("hsl.s",saturation.value)
    .set("hsl.l",brightness.value)
    .set("hsl.h",hue.value)
    colorDivs[index].style.backgroundColor=color
    colorizeSliders(color,hue,brightness,saturation)

}

function updateTextUI(index){
    const activeDiv=colorDivs[index]
    const color=chroma(activeDiv.style.backgroundColor)
    const textHEX=activeDiv.querySelector("h2")
    const icons=activeDiv.querySelectorAll(".controls button")
    textHEX.innerText=color.hex()

    checkTextContrast(color,textHEX)
    for (icon of icons){
        checkTextContrast(color,icon)
    }
}

function resetInputs(){
    colorDivs.forEach((div, i) => {
        const color = initialColors[i],
          hueValue = chroma(color).hsl()[0],
          satValue = chroma(color).hsl()[1],
          brightValue = chroma(color).hsl()[2];
        sliders[0 + 3 * i].value = Math.floor(hueValue);
        sliders[1 + 3 * i].value = Math.floor(brightValue * 100) / 100;
         sliders[2 + 3 * i].value = Math.floor(satValue * 100) / 100;

    
      });

    }
function copyToClipboard(hex){
    const el=document.createElement('textarea')
    el.value=hex.innerText 
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    const popupBox=popup.children[0]
    popup.classList.add("active")
    popupBox.classList.add("active")

}   
function openAdjustmentPanel(index){
    sliderContainers[index].classList.toggle("active")
}

function closeAdjustmentPanel(index){
    sliderContainers[index].classList.toggle("active")
}

const saveBtn=document.querySelector('.save')
const submitSave=document.querySelector('.submit-save')
const closeSave=document.querySelector(".close-save")
const saveContainer=document.querySelector('.save-container')
const saveInput=document.querySelector(".save-container input")
const libraryContainer=document.querySelector(".library-container")
const libraryBtn=document.querySelector(".library")

const closeLibraryBtn=document.querySelector(".close-library")

submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click",openLibrary)
closeLibraryBtn.addEventListener("click",closeLibrary)

saveBtn.addEventListener("click",openPalette)
closeSave.addEventListener("click",closePalette)
function openPalette(e){
    const popup=saveContainer.children[0]
     saveContainer.classList.add("active")
     popup.classList.add("active")
}
function closePalette(e){
        const popup=saveContainer.children[0]
     saveContainer.classList.remove("active")
     popup.classList.remove("active")
}

function savePalette(e){
    saveContainer.classList.remove("active")
    popup.classList.remove("active")
    const name=saveInput.value
    const colors=[]
    currentHexes.forEach(hex=>{
        colors.push(hex.innerText)
    })

    let paletteNumber
    const paletteObjects=JSON.parse(localStorage.getItem("palettes"))
    if (paletteObjects){
        paletteNumber=paletteObjects.length 
    }
    else{
        paletteNumber=savedPalettes.length
    }
   const paletteObj={name,colors,nr:paletteNumber} 
   savedPalettes.push(paletteObj)
   savetoLocal(paletteObj)
   saveInput.value=""
   const palette =document.createElement('div')
   palette.classList.add("custom-palette")
   const title=document.createElement('h4')
   title.innerText=paletteObj.name
   const preview=document.createElement("div")



   
   preview.classList.add("small-preview")
   paletteObj.colors.forEach(smallColor =>{
       const smallDiv=document.createElement('div')
       smallDiv.style.backgroundColor=smallColor 
       preview.appendChild(smallDiv)
   })
   const paletteBtn=document.createElement('button')
   paletteBtn.classList.add("pick-palette-btn")
   paletteBtn.classList.add(paletteObj.nr)
   paletteBtn.innerText="select"

   paletteBtn.addEventListener("click",e=>{
       closeLibrary()
       const paletteIndex=e.target.classList[1]
       initialColors=[]
       savedPalettes[paletteIndex].colors.forEach((color,index)=>{
           initialColors.push(color)
           colorDivs[index].style.backgroundColor=color
           const text=colorDivs[index].children[0]
           checkTextContrast(color,text)
           updateTextUI(index)
           const c = chroma(color);
        const hue = sliderContainers[index].querySelectorAll("input[type='range']")[0];
        const brighanesss = sliderContainers[index].querySelectorAll("input[type='range']")[1];
        const saturation = sliderContainers[index].querySelectorAll("input[type='range']")[2];
        colorizeSliders(c, hue, brighanesss, saturation);
       })
       resetInputs()
   })


   palette.appendChild(title)
   palette.appendChild(preview)
   palette.appendChild(paletteBtn)
   libraryContainer.children[0].appendChild(palette)
}

function savetoLocal(paletteObj){
    let localPalettes
    if (localStorage.getItem('palettes')===null){
        localPalettes=[]
    }else{
        localPalettes=JSON.parse(localStorage.getItem("palettes"))
    }
    localPalettes.push(paletteObj)
    localStorage.setItem("palettes",JSON.stringify(localPalettes))
}

function openLibrary(){
    const popup=libraryContainer.children[0]
    libraryContainer.classList.add("active")
    popup.classList.add("active")
}
function closeLibrary(){
    const popup=libraryContainer.children[0]
    libraryContainer.classList.remove("active")
    popup.classList.remove("active")
}
function getLocal(){
    if (localStorage.getItem('palettes')===null){
        localPalettes=[]
    }else{
        const paletteObjects=JSON.parse(localStorage.getItem("palettes"))
        savedPalettes=[...paletteObjects]
        paletteObjects.forEach(paletteObj=>{
            const del=document.createElement("button")
            del.classList.add("del")
            del.innerText="delete"


            del.classList.add("delete-palette");
            del.classList.add(paletteObj.nr);
            del.innerHTML = "<i class='fas fa-trash'></i>";
            del.addEventListener("click",(e)=>{
                const index=e.target.classList[1]
                delItem(e,index)
            })


            const palette =document.createElement('div')
            palette.classList.add("custom-palette")
            const title=document.createElement('h4')
            title.innerText=paletteObj.name
            const preview=document.createElement("div")
            preview.classList.add("small-preview")
            palette.appendChild(del)
            paletteObj.colors.forEach((smallColor,index) =>{
                const smallDiv=document.createElement('div')
                smallDiv.style.backgroundColor=smallColor 
                preview.appendChild(smallDiv)
                
                const c = chroma(smallColor);
                const hue = sliderContainers[index].querySelectorAll("input[type='range']")[0];
                const brighanesss = sliderContainers[index].querySelectorAll("input[type='range']")[1];
                const saturation = sliderContainers[index].querySelectorAll("input[type='range']")[2];
                colorizeSliders(c, hue, brighanesss, saturation);
            })
            const paletteBtn=document.createElement('button')
            paletteBtn.classList.add("pick-palette-btn")
            paletteBtn.classList.add(paletteObj.nr)
            paletteBtn.innerText="select"
         
            paletteBtn.addEventListener("click",e=>{
                closeLibrary()
                const paletteIndex=e.target.classList[1]
                initialColors=[]
                paletteObjects[paletteIndex].colors.forEach((color,index)=>{
                    initialColors.push(color)
                    colorDivs[index].style.backgroundColor=color
                    const text=colorDivs[index].children[0]
                    checkTextContrast(color,text)
                    updateTextUI(index)
                })
                resetInputs()
            })
         
         
            palette.appendChild(title)
            palette.appendChild(preview)
            palette.appendChild(paletteBtn)
            libraryContainer.children[0].appendChild(palette)

        })
    }
}

function delItem(e,index){
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
  let i = 0;
  paletteObjects.forEach((x) => {
    if (x.name === e.target.parentElement.children[0].innerText) {
      paletteObjects.splice(i, 1);
      console.log(`removed ${i}: @${x.name}`);
    }
  });
  updatedPalettes = JSON.stringify(paletteObjects);
  localStorage.setItem("palettes", updatedPalettes);
  e.target.parentElement.remove();
}



getLocal()
randomColors()

