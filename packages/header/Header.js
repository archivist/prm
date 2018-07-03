import { Component } from 'substance'

class Header extends Component {
  didMount() {
    // let hambEl = this.el.find('.hamburger')
    // let subMenu = this.el.find('.fixed-header__submenu')
    // hambEl.on('click', () => {
    //   if(hambEl.className.indexOf('active') > -1) {
    //     hambEl.className = 'hamburger'
    //     subMenu.className = 'fixed-header__submenu'
    //   } else {
    //     hambEl.className += ' active'
    //     subMenu.className += ' active'
    //   }
    // })
  }

  render($$) {
    let el = $$('div').addClass('sc-header')

    el.setInnerHTML('<div class="container main-header">100 лет после гражданской войны</div><nav class="navbar navbar-default"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle nav-icon collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/icons.svg#menu"></use></svg></button><a class="mobile-search mobile nav-icon show-search" href="#"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/icons.svg#search"></use></svg></a></div><div id="navbar" class="navbar-collapse collapse" aria-expanded="false" style="height: 1px;"><ul class="nav navbar-nav navbar-right desktop"><li><a class="nav-icon show-search" href="#"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/icons.svg#search"></use></svg></a></li></ul><ul class="nav navbar-nav "><li class="mobile mobile-close"><a class="nav-icon" href="#"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/icons.svg#close"></use></svg></a></li><li class="mobile mobile-home"><a href="/">Главная</a></li><li><a href="/about">О проекте</a></li><li><a href="/list">Досье</a></li><li><a href="http://bunt.rj.j-vista.ru/geo">География</a></li><li><a href="http://bunt.rj.j-vista.ru/archive">Онлайн-архив</a></li></ul></div></div><div class="search-form" style="display: none;"><div class="container"><form action="http://bunt.rj.j-vista.ru/archive"><input type="text" name="query" autocomplete="off" placeholder="Слово или фраза для поиска" value=""><button title="Искать">→</button></form></div></div></nav>')

    return el
  }
}

export default Header
