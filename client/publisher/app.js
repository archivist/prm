import { substanceGlobals } from 'substance'
import { Archivist, ArchivistConfigurator } from 'archivist-js'
import Package from './package'

substanceGlobals.DEBUG_RENDERING = true;
let configurator = new ArchivistConfigurator().import(Package);

window.onload = function() {
  window.app = Archivist.mount({
    configurator: configurator
  }, document.body);
};