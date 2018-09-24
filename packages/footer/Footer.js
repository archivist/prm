import { Component } from 'substance'

class Footer extends Component {
  render($$) {
    let el = $$('div').addClass('sc-footer')

    el.setInnerHTML('<div class="footer">	<div class="container">	<div class="footer-fond"> <a href="https://президентскиегранты.рф/" target="_blank" rel="nofollow">  	<img src="/assets/fond.svg"> </a> 	</div>	<div class="footer-social desktop"><a href="#"><img src="/assets/s_fb.png"></a><a href="#"><img src="/assets/s_vk.png"></a><a href="#"><img src="/assets/s_yt.png"></a>	</div>	<div class="footer-links"><a href="http://warandpeasant.ru/about">О проекте</a><a href="http://warandpeasant.ru/list">Публикации</a><a href="http://archive.warandpeasant.ru/maps">География</a><a href="http://archive.warandpeasant.ru">Онлайн-архив</a></div>	<div class="footer-social mobile"><a href="#"><img src="/assets/s_fb.png"></a><a href="#"><img src="/assets/s_vk.png"></a><a href="#"><img src="/assets/s_yt.png"></a>	</div><div class="footer-bottom">	<div class="footer-rules">	</div><a href="http://warandpeasant.ru/rules" class="rules">Правила цитирования и публикации материалов сайта</a>	<div class="footer-copy">2018 © 100 лет после гражданской войны	</div></div><div class="rules-overlay">	<a class="nav-icon rules-close" href="#"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons.svg#close"></use></svg>	</a>	<div class="rules-content"></div></div>  </div></div>')

    return el
  }
}

export default Footer
