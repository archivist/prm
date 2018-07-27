import { Component } from 'substance'

class Header extends Component {
  didMount() {
    let searchToggles = this.el.findAll('.show-search')
    searchToggles.forEach(toggle => {
      toggle.on('click', e => {
        e.preventDefault()
        if(this.props.searchbox !== false) {
          let searchForm = this.el.find('.search-form')
          let invisible = searchForm.el.style.display === 'none'
          if(invisible) {
            searchForm.setStyle('display','block')
          } else {
            searchForm.setStyle('display','none')
          }
        } else {
          this.send('toogleSearch')
        }
      })
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-prm-header')

    el.append(
      $$('div').addClass('container main-header')
        .append('100 лет после гражданской войны')
    )

    let navbarHeader = $$('div').addClass('navbar-header').setInnerHTML('<button type="button" class="navbar-toggle collapsed nav-icon" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons.svg#menu"></use></svg></button><a class="mobile-search mobile nav-icon show-search" href="#"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons.svg#search"></use></svg></a>')

    let lists = $$('div').addClass('collapse navbar-collapse internal').attr('id','navbar')
      .setInnerHTML('<ul class="nav navbar-nav navbar-right desktop"><li><a class="nav-icon show-search" href="#"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons.svg#search"></use></svg></a></li></ul><ul class="nav navbar-nav "><li class="mobile mobile-close"><a class="nav-icon" href="#"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons.svg#close"></use></svg></a></li><li class="mobile mobile-home"><a href="http://warandpeasant.ru">Главная</a></li><li class="active menu-home"><a href="/" class="nav-icon"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons.svg#home"></use></svg></a></li><li class="active"><a href="http://archive.warandpeasant.ru/archive">Онлайн-архив</a></li><li><a href="http://warandpeasant.ru/list">Досье</a> </li> <li> <a href="http://warandpeasant.ru/about">О проекте</a></li><li><a href="http://archive.warandpeasant.ru/geo">География</a></li></ul>')

    let searchForm = $$('div').addClass('search-form').setStyle('display','none')
      .setInnerHTML('<div class="container"><form action="http://bunt.rj.j-vista.ru/archive"><input type="text" name="query" autocomplete="off" placeholder="Слово или фраза для поиска" value=""><button title="Искать">→</button></form></div>')

    let navbar = $$('div').addClass('navbar navbar-default').append(
      $$('div').addClass('container').append(
        navbarHeader,
        lists
      )
    )

    if(this.props.searchbox !== false) {
      navbar.append(searchForm)
    }

    el.append(navbar)
    
    return el
  }
}

export default Header
