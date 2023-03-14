import { GithubUser } from "./GithubUser.js"

let count
count = 0
const bottomPart = document.querySelector(".bottomPart")


export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.load()

    
  }


load () {
  this.entries = JSON.parse(localStorage.getItem(`@github-favorites:`)) || []
}

save() {
  localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
}



async add(username){
  try{

    const userExists = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase())

    if(userExists) {
      throw new Error ("Usuário já cadastrado")
    }

    const user = await GithubUser.search(username)

    if(user.login === undefined){
      throw new Error("Usuário não encontrado!")
    }

    this.entries = [user, ...this.entries]
    this.update()
    this.save()

  } catch(error){
    alert(error.message)

    
  }
  

}

delete(user){
  const filteredEntries = this.entries
  .filter(entry => entry.login !== user.login)

  

  this.entries = filteredEntries
  this.update()
  this.save()
}
}





export class FavoritesView extends Favorites {
 constructor(root){
  super(root)

  this.tbody = this.root.querySelector("table tbody")

  this.update()
  this.onadd()
 }

 onadd(){
  const addButton = this.root.querySelector(".search button")
  addButton.onclick = () => {
    const {value} = this.root.querySelector(".search input")

    
    // aumenta o count 
    console.log(count)
    const countadd = ++count
    console.log(count)
    updateCount()
    

    this.add(value)
  }
 }

 update(){
  this.removeAlltr()


 
 this.entries.forEach( user => {
const row = this.createRow()

row.querySelector(".user img").src = `https://github.com/${user.login}.png`
row.querySelector(".user img").alt = `Imagem de ${user.name}`
row.querySelector(".user a").href = `https://github.com/${user.login}`
row.querySelector(".user p").textContent = user.name
row.querySelector(".user span").textContent = user.login
row.querySelector(".repositories").textContent = user.public_repos
row.querySelector(".followers").textContent = user.followers
row.querySelector(".remove").onclick = () => {
  const isOk = confirm("tem certeza que deseja deletar essa linha?")
  if(isOk){
    this.delete(user)

    //diminuir o count
    console.log(count)
    const countminus = --count;
    console.log(count)
    updateCount()
  }
}

this.tbody.append(row)
})

}


 createRow(){

  const tr = document.createElement("tr")
  tr.innerHTML = `
    
    <td class="user">
      <img src="https://github.com/Eduardoex.png" alt="Imagem de Eduardo">
      <a href="https://github.com/Eduardoex" target="_blank">
      <p>Eduardo</p>
      <span>Eduardo</span>
      </a>
    </td>
    <td class="repositories">
      14
    </td>
    <td class="followers">
      1
    </td>
    <td>
      <button class="remove">remover</button>
    </td>
  
`

  return tr
 }

 removeAlltr(){
  this.tbody.querySelectorAll("tr")
  .forEach((tr) => {tr.remove()})
 }
}

function updateCount(){
  if(count <= 0) 
  {bottomPart.classList.remove("hide");
   return
  }
  else (count > 0)
  {bottomPart.classList.add("hide")
  }
  
  
}