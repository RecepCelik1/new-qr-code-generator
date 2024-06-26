import emailjs from 'emailjs-com';

class SubmitterClass {

    constructor (mailContent,eMail){
      this.mailContent = mailContent;
      this.eMail = eMail;
    }

    static mailSenderFunction(eMail , mailContent) {
/*           const templateParams = {
            userMail: eMail,
            mailContent : mailContent,
            };
  
          emailjs.send('service_y2f03bx', 'template_d3o6f1p', templateParams, '2pfagknunisGtMP7_')
            .then((response) => {
              console.log('SUCCESS!', response.status, response.text);
            }, (error) => {
              console.error('FAILED...', error);
            }); */
    }

    sendMail (){
      SubmitterClass.mailSenderFunction(this.eMail , this.mailContent)
    }

    QrCodeData (){
      return this.mailContent;
    }

}

class WebUrlSubmitter extends SubmitterClass {
    constructor (webUrl , eMail) {
        super(`${webUrl}` , eMail);
    }
}

class PhoneNumberSubmitter extends SubmitterClass {
    constructor(phoneNumber, eMail) {
        super(`tel:${phoneNumber}` , eMail);
    }
}

class SmsSubmitter extends SubmitterClass {
    constructor (phoneNumberForSendingSms, smsContent, eMail) {
        super(`smsto:${phoneNumberForSendingSms}:${smsContent}` , eMail);
      }
}

class SimpleTextSubmitter extends SubmitterClass {
    constructor (simpleText , eMail) {
        super(simpleText , eMail);
      }
}

class DependencyManager {

  constructor() {
    this.submitterClass = null;
  }

  addDependency (dependencyToBeInjected) {
    this.submitterClass = dependencyToBeInjected;
    return this.submitterClass;
  }

  clearDependency () {
    this.submitterClass = null;
  }
}

export { WebUrlSubmitter , PhoneNumberSubmitter , SmsSubmitter , SimpleTextSubmitter , DependencyManager }