
<style>
.theme--light.application--linear-gradient{background: none !important}
.theme--dark.application--linear-gradient{background: #212429 !important}

.theme--dark .app-navigation.v-bottom-nav{ background-color: #303136 !important}
.theme--dark .app-toolbar-centered .v-toolbar{ background-color: #303136 !important}
/* .a-container{background-color: #303136; padding-left: 10px} */
/* .bg9{background: #ffffffcf !important}
.bg08{background: #21a4b2} */

.v-label{font-size:14px !important}

 
  
    
  .theme--dark.v-btn.v-btn--primary:not(.v-btn--icon):not(.v-btn--flat) {
      background-color: #5ac8fa;
      color: #000;
      width: 50%;
      margin-bottom:22px;
    
}
.theme--dark.v-btn{
   /* border: 1px solid #5ac8fa; */

    margin-top: 15px;
    color:#c5994a
    }

    .login-page__title{font-weight:bold!important ;font-size:30px!important}
    .login-page__subtitle{font-weight:400!important}
   .theme--dark .svg-icon {
    fill: #eeba52;
}

</style>
<template>
  <v-layout row fill-height justify-center bg08 class="login-page">

    <container class="bg9">

      <div class="text-xs-right">
        <language-switcher>
          <v-icon slot="prepend" size="18">mdi-chevron-right</v-icon>
        </language-switcher>
      </div>

      <v-card flat color="transparent" class="text-xs-center mt-3">
        <img
          :src="logo"
          class="logo"
        />

        <h1 class="login-page__title">{{ $t('login.brand_title') }} </h1>
        <h2 class="hidden-sm-and-down login-page__subtitle mt-3">{{ $t('login.subheader') }}</h2>
      </v-card>
      <v-layout justify-center class="mt-5">
          <x-btn
            icon
            flat
            fab
            @click="showQrcodeScanner = true"
            :title="$t('login.scan_qr_code_button_tooltip')"
          >
            <icon><qr-code-scan-icon/></icon>
          </x-btn>

          <x-btn class="ml-4" @click="openFileDialog" :title="$t('login.login_by_qr_code_tooltip')" icon flat fab>
            <icon><file-icon/></icon>
          </x-btn>
 </v-layout>

      <v-card v-if="!isLoginViaPassword" flat color="transparent" class="text-xs-center mt-3">
        <v-layout justify-center>
          <v-flex xs12 sm8 md8 lg8>

            <login-form
              v-model="passphrase"
              @login="onLogin"
              @error="onLoginError"
            >
              <template slot="append-outer">
                <icon
                  class="ml-2"
                  :width="24"
                  :height="24"
                  shape-rendering="crispEdges"
                  :color="showQrcodeRenderer ? this.$vuetify.theme.primary : ''"
                  @click="toggleQrcodeRenderer"
                >
                  <qr-code-icon/>
                </icon>
              </template>

              <template slot="qrcode-renderer">
                <div @click="saveQrcode" :style="{ cursor: 'pointer' }">
                  <transition name="slide-fade">
                    <QrcodeRenderer v-if="showQrcodeRenderer" :text="passphrase" ref="qrcode" />
                  </transition>
                </div>
              </template>
            </login-form>

          </v-flex>
        </v-layout>

       
      </v-card>

      <v-layout v-if="!isLoginViaPassword" justify-center class="mt-2">
        <v-flex xs12 sm8 md8 lg8>
          <passphrase-generator
            @copy="onCopyPassphraze"
          />
        </v-flex>
      </v-layout>

      <v-card v-if="isLoginViaPassword" flat color="transparent" class="text-xs-center mt-3">
        <v-layout justify-center>
          <v-flex xs12 sm8 md8 lg8>

            <login-password-form
              v-model="password"
              @login="onLogin"
              @error="onLoginError"
            />

          </v-flex>
        </v-layout>
      </v-card>

      <qrcode-scanner-dialog
        v-if="showQrcodeScanner"
        v-model="showQrcodeScanner"
        @scan="onScanQrcode"
      />

    </container>

  </v-layout>
</template>

<script>
import b64toBlob from 'b64-to-blob'
import FileSaver from 'file-saver'
import { QrcodeCapture } from 'vue-qrcode-reader'

import LanguageSwitcher from '@/components/LanguageSwitcher'
import PassphraseGenerator from '@/components/PassphraseGenerator'
import LoginForm from '@/components/LoginForm'
import QrcodeScannerDialog from '@/components/QrcodeScannerDialog'
import QrcodeRenderer from '@/components/QrcodeRenderer'
import Icon from '@/components/icons/BaseIcon'
import QrCodeIcon from '@/components/icons/common/QrCode'
import QrCodeScanIcon from '@/components/icons/common/QrCodeScan'
import FileIcon from '@/components/icons/common/File'
import LoginPasswordForm from '@/components/LoginPasswordForm'
import AppInterval from '@/lib/AppInterval'

export default {
  computed: {
    showQrcodeRenderer () {
      return this.isQrcodeRendererActive && this.passphrase
    },
    isLoginViaPassword () {
      return this.$store.getters['options/isLoginViaPassword']
    }
  },
  data: () => ({
    passphrase: '',
    password: '',
    showQrcodeScanner: false,
    isQrcodeRendererActive: false,
    logo: '/img/tyslin-logo-transparent-512x512.png'
  }),
  methods: {
    async onDetect (promise) {
      try {
        const { content } = await promise // Decoded string or null
        if (content && /^([a-z]{3,8}\x20){11}[A-z]{3,8}$/i.test(content.trim())) {
          this.passphrase = content
        } else {
          this.passphrase = ''
          this.$store.dispatch('snackbar/show', {
            message: this.$t('login.invalid_qr_code')
          })
        }
      } catch (error) {
        console.error(error)
      }
    },
    onLogin () {
      this.$router.push('/chats')

      if (!this.$store.state.chat.isFulfilled) {
        this.$store.commit('chat/createTyslinChats')
        this.$store.dispatch('chat/loadChats')
          .then(() => AppInterval.subscribe())
      } else {
        AppInterval.subscribe()
      }
    },
    onLoginError (key) {
      this.$store.dispatch('snackbar/show', {
        message: this.$t(key)
      })
    },
    onCopyPassphraze () {
      this.$store.dispatch('snackbar/show', {
        message: this.$t('home.copied'),
        timeout: 1500
      })
    },
    onScanQrcode (passphrase) {
      this.$store.dispatch('login', passphrase)
        .then(() => {
          this.onLogin()
        })
        .catch(err => {
          this.onLoginError(err)
        })
    },
    openFileDialog () {
      this.$refs.qrcodeCapture.$el.click()
    },
    saveQrcode () {
      const imgUrl = this.$refs.qrcode.$el.src
      const base64Data = imgUrl.slice(22, imgUrl.length)
      const byteCharacters = b64toBlob(base64Data)
      const blob = new Blob([byteCharacters], { type: 'image/png' })
      FileSaver.saveAs(blob, 'tyslin-im.png')
    },
    toggleQrcodeRenderer () {
      this.isQrcodeRendererActive = !this.isQrcodeRendererActive
    }
  },
  components: {
    LanguageSwitcher,
    PassphraseGenerator,
    LoginForm,
    QrcodeScannerDialog,
    QrcodeRenderer,
    QrcodeCapture,
    Icon,
    QrCodeIcon,
    QrCodeScanIcon,
    FileIcon,
    LoginPasswordForm
  }
}
</script>

<style lang="stylus" scoped>
@import '~vuetify/src/stylus/settings/_variables.styl'

.login-page
  &__title
    font-family: 'Exo 2'
    font-weight: 100
    font-size: 45px
    line-height: 40px
    text-transform: uppercase
  &__subtitle
    font-family: 'Exo 2'
    font-weight: 100
    font-size: 18px

.logo
  width: 213px
  height: 213px

@media $display-breakpoints.sm-and-up
  .logo
    width: 300px
    height: 300px
</style>
