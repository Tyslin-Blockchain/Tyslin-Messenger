<style>
.text-center{ text-align: center; color: #000;background-color: #e8f3f3;
    padding: 15px;
    box-shadow: 2px 2px 2px 2px #cccccc70;}

.a-chat__form{padding-top: 10px !important;
padding-bottom: 10px !important; border-radius:45px}




.bt5{ width: 100%; height: 130px; background-color: #ccc; margin-top: 10px;}

.theme--light .app-navigation.v-bottom-nav{background-color: #e2e2e2 !important}

.v-item-group.v-bottom-nav .v-btn--active{color: #007dfd;}

.v-item-group.v-bottom-nav .v-btn--active{background-color: #6c6c6c33 !important;}

.theme--dark .app-toolbar-centered .v-toolbar{background-color:rgb(62, 62, 62) !important}

.v-btn--active.v-btn.v-btn--flat.v-btn--router.theme--dark{background-color:#ffffff1a !important}
.v-btn--active.v-btn.v-btn--flat.v-btn--router.theme--light{background-color:#cecece !important}




</style>
<template>
  <v-layout row wrap justify-center class="home-page">

    

    <container class="bg33">

      <v-card flat class="transparent white--text">

      <h3 class="text-center" style="background-color: #3e3e3e;
color: rgb(255, 255, 255);
box-shadow: 2px 2px 2px 2px #6f6f6f1a;">TYSLIN WALLET</h3>
      
   <br><br>
  
 
        <!-- Wallets -->
        <v-card class="home-page__wallets">
          <v-tabs grow slider-color="white">
            <v-tab
              v-for="wallet in wallets"
              :key="wallet.cryptoCurrency"
            >
              <div>
                <icon :width="36" :height="36" fill="#BDBDBD" slot="icon" class="mb-2">
               
                  <component :is="wallet.icon"/>
                </icon>
                <div>{{ wallet.balance | numberFormat(4)  }}</div>
                <div>{{ wallet.cryptoCurrency }}</div>
              </div>
            </v-tab>

            <v-tab-item
              v-for="wallet in wallets"
              :key="wallet.cryptoCurrency"
            >
            
              <wallet-card
                :address="wallet.address"
                :balance="wallet.balance"
                :crypto="wallet.cryptoCurrency"
                :crypto-name="wallet.cryptoName"
                @click:balance="goToTransactions"
              >

             
              </wallet-card>
                <icon :width="125" :height="125" fill="#BDBDBD" slot="icon">
                  <component :is="wallet.icon"/>
                </icon>
                          
      
            </v-tab-item>
          </v-tabs>
        </v-card>

      </v-card>

    </container>

  </v-layout>
</template>





<script>
import WalletCard from '@/components/WalletCard'
import WalletCardListActions from '@/components/WalletCardListActions'

import Icon from '@/components/icons/BaseIcon'
import TysFillIcon from '@/components/icons/TysFill'
import BnbFillIcon from '@/components/icons/BnbFill'
import EthFillIcon from '@/components/icons/EthFill'
import BnzFillIcon from '@/components/icons/BnzFill'
import DogeFillIcon from '@/components/icons/DogeFill'

export default {
  computed: {
    wallets () {
      return [
        {
          address: this.$store.state.address,
          balance: this.$store.state.balance,
          cryptoCurrency: 'TYS',
          cryptoName: 'TYSLIN',
          icon: 'tys-fill-icon'
        }
        // ,{
        //   address: this.$store.state.bnb.address,
        //   balance: this.$store.state.bnb.balance,
        //   cryptoCurrency: 'BNB',
        //   cryptoName: 'Binance Coin',
        //   icon: 'bnb-fill-icon'
        // },
        // {
        //   address: this.$store.state.eth.address,
        //   balance: this.$store.state.eth.balance,
        //   cryptoCurrency: 'ETH',
        //   cryptoName: 'Ethereum',
        //   icon: 'eth-fill-icon'
        // },
        // {
        //   address: this.$store.state.bz.address,
        //   balance: this.$store.state.bz.balance,
        //   cryptoCurrency: 'BZ',
        //   cryptoName: 'Bit-Z',
        //   icon: 'bnz-fill-icon'
        // },
        // {
        //   address: this.$store.state.doge.address,
        //   balance: this.$store.state.doge.balance,
        //   cryptoCurrency: 'DOGE',
        //   cryptoName: 'DOGE',
        //   icon: 'doge-fill-icon'
        // }
      ]
    }
  },
  methods: {
    goToTransactions (crypto) {
      this.$router.push({
        name: 'Transactions',
        params: {
          crypto
        }
      })
    }
  },
  components: {
    WalletCard,
    Icon,
    TysFillIcon,
    BnbFillIcon,
    EthFillIcon,
    BnzFillIcon,
    DogeFillIcon
  }
}
</script>

<style lang="stylus" scoped>
@import '~vuetify/src/stylus/settings/_colors.styl'

/**
 * 1. Reset VTabs container fixed height.
 */
.home-page__wallets >>> .v-tabs__container
  height: auto // [1]

/** Themes **/
.theme--light
  .action-list
    &__icon
      background-color: $grey.lighten-1
      color: $shades.white
.theme--dark
  .action-list
    &__icon
      background-color: $grey.darken-3
      color: $shades.white
</style>


