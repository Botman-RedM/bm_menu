fx_version 'cerulean'
games { 'rdr3' }
rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

author 'BOTMAN'
description 'Custom Menu System for RedM'
version '1.0.0'

ui_page 'web/index.html'

client_scripts {
    'client.lua'
}

files {
    'web/index.html',
    'web/style.css',
    'web/script.js',
    'web/assets/*.webp',
    'web/assets/*.jpg',
    'web/assets/*.png'
}
