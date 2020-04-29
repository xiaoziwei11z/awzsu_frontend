import Cookies from 'js-cookie'

export function setUser(token,id,name,image) {
  Cookies.set("User-Token", token)
  Cookies.set("User-Id", id)
  Cookies.set("User-Name", name)
  Cookies.set("User-Image", image)
}

export function setUserDetail(name,image) {
  Cookies.set("User-Name", name)
  Cookies.set("User-Image", image)
}

export function getUser() {
  return {
    token:Cookies.get("User-Token"),
    id:Cookies.get("User-Id"),
    name:Cookies.get("User-Name"),
    image:Cookies.get("User-Image")
  }
}

export function removeUser() {
  Cookies.remove("User-Token")
  Cookies.remove("User-Id")
  Cookies.remove("User-Name")
  Cookies.remove("User-Image")
}
