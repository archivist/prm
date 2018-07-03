import { Component } from 'substance'

class Footer extends Component {
  render($$) {
    let el = $$('div').addClass('sc-footer')

    el.setInnerHTML('<div class="footer">	<div class="container">	<div class="footer-fond"> <a href="https://президентскиегранты.рф/" target="_blank" rel="nofollow">  	<img src="/img/fond.svg"> </a> 	</div>	<div class="footer-social desktop"><a href="#"><img src="/img/s_fb.png"></a><a href="#"><img src="/img/s_vk.png"></a><a href="#"><img src="/img/s_yt.png"></a>	</div>	<div class="footer-links"><a href="/about">О проекте</a><a href="/list">Досье</a><a href="http://bunt.rj.j-vista.ru/geo">География</a><a href="http://bunt.rj.j-vista.ru/archive">Онлайн-архив</a></div>	<div class="footer-social mobile"><a href="#"><img src="/img/s_fb.png"></a><a href="#"><img src="/img/s_vk.png"></a><a href="#"><img src="/img/s_yt.png"></a>	</div><div class="footer-bottom">	<div class="footer-rules">	</div><a href="/rules" class="rules">Правила цитирования и публикации материалов сайта</a>	<div class="footer-copy">2018 © 100 лет после гражданской войны	</div></div><div class="rules-overlay">	<a class="nav-icon rules-close" href="#"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/icons.svg#close"></use></svg>	</a>	<div class="rules-content"></div></div>  </div></div>')

    return el
  }
}

export default Footer
