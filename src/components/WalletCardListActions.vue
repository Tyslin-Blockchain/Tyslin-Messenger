<style>
.skyblue{ background-color:#007dfd;    padding: 31px;
    text-align: center;
    border-radius: 12px;
    margin-bottom: 40px;    align-items: center;
    height: 60px;
    display: flex;
    justify-content: center; margin-right:30px; margin-left:29px}

    .pl-55{padding-left:36px; padding-right:40px}

    .theme--dark.v-list .v-list__group__header:hover, .theme--dark.v-list .v-list__tile--highlighted, .theme--dark.v-list .v-list__tile--link:hover{background:none}

    .theme--dark .app-navigation.v-bottom-nav{background-color:rgb(62, 62, 62) !important}

    .green2{ background-color:#1aaa87;    padding: 31px;
    text-align: center;
    border-radius: 12px;
    margin-bottom: 40px;     align-items: center;
    height: 60px;
    display: flex;
    justify-content: center;margin-right:30px}

     .yello2{ background-color:#eeb954;    padding: 31px;
    text-align: center;
    border-radius: 12px;
    margin-bottom: 40px;     align-items: center;
    height: 60px;
    display: flex;
    justify-content: center;margin-right:30px}
    .flex2{display: flex;
    align-items: center;
    justify-content: center;}

    .v-item-group.v-bottom-nav .v-btn--active .v-btn__content .v-icon   { color:#007dfd !important}

    .pla {
    padding-left: 42px !important;}

    .mla {
    margin-left: -14px;}

    .v-content__wrap{padding-top:20px;padding-left:20px;padding-right:30px; padding-bottom:20px}

    @media (max-width: 768px) {
      .v-content__wrap{padding-top:0px;padding-left:20px;padding-right:30px; padding-bottom:0px}
      .v-dialog{ width:100% !important}
      .search3{margin-right:15px}
      
.skyblue{margin-left: 31px !important;

height: 20px;

margin-bottom: 11px;}
.green2{margin-left: 31px !important;

height: 20px;

margin-bottom: 11px;}

.yello2{margin-left: 31px !important;

height: 20px;

margin-bottom: 11px;}

.pl-55{padding-left:0px; padding-right:0px}



.pla {
    padding-left: 17px !important;
}

.mla{ margin-left:-14px}

.v-toolbar__content > :first-child.v-btn--icon, .v-toolbar__extension > :first-child.v-btn--icon{margin-left:9px !important}

}
</style>

<template>

  <v-list>
  <div class="row flex2">
 

   <div class="col-md-3 skyblue">

    <v-list-tile @click="sendFunds" avatar>
      <v-list-tile-avatar>
        <v-icon class="action-list__icon">mdi-cube-send</v-icon>
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title>{{ $t('home.send_btn') }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
   </div>
  <div class="col-md-3 green2">
    <v-list-tile @click="buyTokens" avatar>
      <v-list-tile-avatar>
        <v-icon class="action-list__icon">mdi-cash-usd</v-icon>
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title>{{ $t('home.invest_btn') }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
</div>
 <div class="col-md-3 yello2">
    <v-list-tile @click="getFreeTokens" avatar>
      <v-list-tile-avatar>
        <v-icon class="action-list__icon">mdi-gift</v-icon>
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title>{{ $t('home.free_tys_btn') }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    </div>
    
   </div>
  </v-list>
</template>




   



<script>
import { Cryptos } from '@/lib/constants'

export default {
  computed: {
    hasTysTokens () {
      return this.$store.state.balance > 0
    }
  },
  methods: {
    sendFunds () {
      this.$router.push({
        name: 'SendFunds',
        params: {
          cryptoCurrency: this.crypto
        }
      })
    },
    buyTokens () {
      window.open('https://tyslin.com/buycoins', '_blank')
    },
    getFreeTokens () {
      window.open('https://tyslin.com/getToken', '_blank')
    },
  },
  props: {
    crypto: {
      type: String,
      default: Cryptos.TYS,
      validator: v => v in Cryptos
    }
  }
}
</script>
