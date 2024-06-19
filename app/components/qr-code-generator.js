"use client"
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { WebUrlSubmitter , PhoneNumberSubmitter , SmsSubmitter , SimpleTextSubmitter , DependencyManager } from './classes';
import * as htmlToImage from "html-to-image";

function QrCodeGeneratorComponent () {
    const [isTextFieldsReachesLimit , setIsTextFieldsReachesLimit] = useState(false);
    const [selectedOption , setSelectedOption] = useState("webUrl");
    const [formDatas , setFormDatas] = useState({
        webUrl : "",
        phoneNumber : "",
        phoneNumberForSendingSms : "",
        smsContent : "",
        simpleText : "",
        eMail : "",
    });
    const [qrCodeContent , setQrCodeContent] = useState();
    const qrCodeRef = useRef(null);

    const variableFiller = (inputContent , inputField) => {
        setFormDatas (prevState => ({
            ...prevState,
            [inputField] : inputContent,
        }));
    }
    
    useEffect(() => {
        if((formDatas.smsContent?.length > 160 && selectedOption === "sms") ||
            (formDatas.simpleText?.length > 160 && selectedOption === "simpleText")
        ){
            setIsTextFieldsReachesLimit(true)
        } else {
            setIsTextFieldsReachesLimit(false)
        }
    },[formDatas.smsContent,formDatas.simpleText,selectedOption]);
    
    const dependencyManager = new DependencyManager();

    function handleSubmitMethod (event) {
      event.preventDefault();
      dependencyManager.clearDependency();
      const submitterTypeMap = new Map([
        ['webUrl', new WebUrlSubmitter (formDatas.webUrl , formDatas.eMail)],
        ['phoneNumber', new PhoneNumberSubmitter (formDatas.phoneNumber , formDatas.eMail)],
        ['sms', new SmsSubmitter (formDatas.phoneNumberForSendingSms , formDatas.smsContent , formDatas.eMail)],
        ['simpleText', new SimpleTextSubmitter (formDatas.simpleText , formDatas.eMail)]
    ]);
    
    const submitterClass = dependencyManager.addDependency(submitterTypeMap.get(selectedOption));
    setQrCodeContent(submitterClass.QrCodeData());
    submitterClass.sendMail(); 
    }


    const downloadQRCode = () => {
      htmlToImage
        .toPng(qrCodeRef.current)
        .then(function (dataUrl) {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "qr-code.png";
          link.click();
        })
        .catch(function (error) {
          console.error("Error generating QR code:", error);
        });
    };

return (
    <div className='flex flex-col sm:flex-row min-h-screen items-center p-3 bg-gray-800'>
        <div className="flex justify-center items-center w-full">
          <div className="bg-white p-8 rounded-3xl border shadow-md w-full max-w-[700px]">
            <h1 className="text-2xl font-bold mb-4">Generate your QR Code</h1>
            <form onSubmit={(event) => handleSubmitMethod(event)}>
              <div className="mb-4">
                <label className="block mb-2 font-bold">Select Data Type:</label>
                <div className='w-full flex flex-col sm:flex-row'>
                  <div className='w-full flex justify-between'>
                    <label className="w-full">
                      <input
                        type="radio"
                        value="webUrl"
                        checked={selectedOption === 'webUrl'}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      />
                      Website URL
                    </label>
                    <label className="w-full">
                      <input
                        type="radio"
                        value="phoneNumber"
                        checked={selectedOption === 'phoneNumber'}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      />
                      Phone#
                    </label>
                  </div>
                  <div className='w-full flex justify-between '>
                    <label className="w-full">
                      <input
                        type="radio"
                        value="sms"
                        checked={selectedOption === 'sms'}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      />
                      SMS
                    </label>
                    <label className='w-full'>
                      <input
                        type="radio"
                        value="simpleText"
                        checked={selectedOption === 'simpleText'}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      />
                      Plain Text
                    </label>
                  </div>
                </div>
              </div>
              {selectedOption === 'webUrl' ? (
                <div>
                  <label>
                    <h2 className='font-bold text-xl'>Website URL</h2>
                    <input
                      type="text"
                      placeholder="https://www.startxpress.io/"
                      className="border border-gray-300 p-2 mb-2 w-full"
                      value={formDatas.webUrl}
                      onChange={(e) => variableFiller(e.target.value , "webUrl")}
                    />
                  </label>
                </div>
              ) : selectedOption === 'phoneNumber' ? (
                <div>
                  <label>
                    <h2 className='font-bold text-xl'>Phone #</h2>
                    <input
                      type="tel"
                      placeholder="Example: 1-888-746-7439"
                      className="border border-gray-300 p-2 mb-2 w-full"
                      value={formDatas.phoneNumber}
                      onChange={(e) => variableFiller(e.target.value , "phoneNumber")}
                    />
                  </label>
                </div>
              ) : selectedOption === 'sms' ? (
                <div className='flex flex-col'>
                  <label>
                    <h2 className='font-bold text-xl'>Mobile #</h2>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="border border-gray-300 p-2 mb-2 w-full"
                      value={formDatas.phoneNumberForSendingSms}
                      onChange={(e) => variableFiller(e.target.value , "phoneNumberForSendingSms")}
                    />
                  </label>
                  <label>
                    <h2 className='font-bold text-xl'>Message</h2>
                    <input
                      type="text"
                      placeholder="Enter message to send"
                      className="border border-gray-300 p-2 mb-2 w-full"
                      value={formDatas.smsContent}
                      onChange={(e) => variableFiller(e.target.value , "smsContent")}
                    />
                    <p className='w-full flex justify-center'>160 characters maximum</p>
                  </label>
                </div>
              ) : (
                <div>
                  <label>
                    <h2 className='font-bold text-xl'>Plain text</h2>
                    <input
                      type="text"
                      placeholder="Address"
                      className="border border-gray-300 p-2 mb-2 w-full"
                      value={formDatas.simpleText}
                      onChange={(e) => variableFiller(e.target.value , "simpleText")}
                    />
                    <p className='w-full flex justify-center'>160 characters maximum</p>
                  </label>
                </div>
              )}
              {isTextFieldsReachesLimit && (
                <div className='w-full flex justify-center items-center text-red-500 text-xs'>Maximum character limit exceeded !!</div>
              )}

              <label>
                <h2 className='font-bold text-xl'>Email code to</h2>
                <input
                  type='email'
                  placeholder='Email address'
                  className="border border-gray-300 p-2 mb-2 w-full"
                  required
                  onChange={(e) => variableFiller(e.target.value , "eMail")}
                  value={formDatas.eMail}
                />
              </label>
              <button
                type="submit"
                className={`${isTextFieldsReachesLimit ? `bg-sky-300` : `bg-sky-600 hover:bg-blue-700`} text-white font-bold py-2 px-4 rounded`}
                disabled={isTextFieldsReachesLimit}
              >
                Submit
              </button>
            </form>
          </div>
          <div className="flex justify-center items-center"></div>
        </div>


        <div className="w-full flex justify-center items-center">
            {qrCodeContent && (
              <div>
                <QRCode ref={qrCodeRef} value={`${qrCodeContent}`} />
                <button onClick={downloadQRCode} className="flex justify-center w-full mt-3 p-3 bg-sky-600 hover:bg-blue-700 text-white font-bold rounded">Download QR Code</button>
              </div>
            )}
        </div>
    </div>
);
}
export default QrCodeGeneratorComponent;