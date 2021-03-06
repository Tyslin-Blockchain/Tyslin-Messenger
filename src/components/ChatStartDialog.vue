<template>
  <v-dialog
    v-model="show"
    width="500"
  >
    <v-card>
      <v-card-title
        class="headline"
        primary-title
      >
        {{ $t('chats.new_chat') }}
      </v-card-title>

      <v-layout row wrap justify-center align-center class="pa-3">

        <v-flex xs10>
          <v-text-field
            v-model="recipientAddress"
            :rules="validationRules"
            :label="$t('chats.recipient')"
            :title="$t('chats.recipient_tooltip')"
          />
        </v-flex>

        <v-flex xs2 class="text-xs-right">
          <v-btn @click="showQrcodeScanner = true" icon flat>
            <v-icon>mdi-qrcode-scan</v-icon>
          </v-btn>
        </v-flex>

        <v-flex xs4 class="text-xs-center">
          <v-btn @click="startChat">{{ $t('chats.start_chat') }}</v-btn>
        </v-flex>

      </v-layout>
    </v-card>

    <qrcode-scanner-dialog
      v-if="showQrcodeScanner"
      v-model="showQrcodeScanner"
      @scan="onScanQrcode"
    />
  </v-dialog>
</template>

<script>
import validateAddress from '@/lib/validateAddress'
import QrcodeScannerDialog from '@/components/QrcodeScannerDialog'

export default {
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    validationRules () {
      return [
        v => validateAddress('TYS', v) || this.$t('chats.incorrect_address')
      ]
    }
  },
  data: () => ({
    recipientAddress: '',
    showQrcodeScanner: false
  }),
  methods: {
    startChat () {
      if (!this.isValidUserAddress()) {
        this.$store.dispatch('snackbar/show', {
          message: this.$t('chats.incorrect_address')
        })

        return Promise.reject(new Error(this.$t('chats.incorrect_address')))
      }

      return this.$store.dispatch('chat/createChat', {
        partnerId: this.recipientAddress
      })
        .then((key) => {
          this.$emit('start-chat', this.recipientAddress)
          this.show = false
        })
        .catch(err => {
          this.$store.dispatch('snackbar/show', {
            message: err.message // @todo translations
          })
        })
    },
    onScanQrcode (userId) {
      this.recipientAddress = userId
      this.startChat()
    },
    isValidUserAddress () {
      return validateAddress('TYS', this.recipientAddress)
    }
  },
  components: {
    QrcodeScannerDialog
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  }
}
</script>
