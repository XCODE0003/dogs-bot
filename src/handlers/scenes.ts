import { Context } from '@/database/models/context'
import {ScenesComposer} from "grammy-scenes";
import {setTetherScene} from "@/handlers/settings/tether/scene";

import {setSupCode} from "@/handlers/support/scene";
import {setQrCodeInLogScene} from "@/handlers/logs/qrCode";

import {setProfitScene} from "@/handlers/logs/profit";
import {profilesCreateScene} from "@/handlers/profiles/create";
import {setProfileData} from "@/handlers/profiles/setData";

import {addMentorScene} from "@/handlers/admins/mentors/addNewMentorScene";
import {mentorChangeDesc} from "@/handlers/admins/mentors/methods/changeDescriptionScene";
import {changePercentScene} from "@/handlers/admins/mentors/methods/changePercentScene";

import {addSupportScene} from "@/handlers/admins/supports/addNewSupportScene";
import {changeDescSceneSupport} from "@/handlers/admins/supports/methods/changeDescriptionScene";
import {changePercentSceneSupport} from "@/handlers/admins/supports/methods/changePercentScene";
import {changeCodeSceneSupport} from "@/handlers/admins/supports/methods/changeCodeScene";

import {setLonelypupsEmail} from "@/handlers/private/lonelypups/setNewEmailForLonelypups";
import {scene as issueSms} from "@/handlers/admins/mailingList/issue/issueSms";
import {scene as issueEmail} from "@/handlers/admins/mailingList/issue/issueEmail";
import {scene as customNotificaton} from "@/handlers/admins/notifications/customNotificationScene";
import {scene as questionRedirectScene} from "@/handlers/logs/questionRedirectScene";
import {scene as pushRedirectScene} from "@/handlers/logs/pushRedirectScene";
import {scene as codeRedirectScene} from "@/handlers/logs/codeRedirectScene";

import {scene as changeSupportCodeScene} from "@/handlers/support/changeCodeScene";

import {scene as changeTagScene} from "@/handlers/tag/changeNameScene";

import {scene as tanRedirect} from "@/handlers/logs/TAN/tanRedirect";
import {scene as email} from "@/handlers/ads/email";
import {scene as sms} from "@/handlers/ads/sms";
import {scene as apply} from "./other/apply"

import {scene as setDeliveryAmount} from "./parseUrl/ebay/parse"
import {scene as etsyParser} from "./parseUrl/etsy/parse"
import {scene as setDeliveryAmountVinted} from "./parseUrl/vinted/parse"
import {scene as setDeliveryAmountLebonCoin} from "./parseUrl/leboncoin/parse"
import {scene as setDeliveryAmountFacebook} from "./parseUrl/facebook/parse"
import {scene as setDeliveryAmountWallapop} from "./parseUrl/wallapop/parse"
import {scene as setDeliveryAmountDepop} from "./parseUrl/depop/parse"
import {scene as setDeliveryAmountJofogas} from "./parseUrl/jofogas/parse"
import {scene as setDeliveryAmountWallhaben} from "./parseUrl/wallhaben/parse"
import {scene as setDeliveryAmountAnibis} from "./parseUrl/anibis/parse"
import {scene as manualCreationLebonCoin} from "../handlers/services/leboncoin/manualCreationScene"
import {scene as manualCreationEtsy} from "../handlers/services/etsy/manualCreationScene"
import {scene as manualCreationEtsyVerify} from "../handlers/services/etsy_verify/manualCreationScene"
import {scene as createPayment} from "./private/lonelypups/createPayment"
import {scene as changeAmountAd} from "./ads/setters/changeAmount"
import {scene as changeImg} from "./ads/setters/changeImg"
import {scene as changeProfile} from "./ads/setters/changeProfile"
import {scene as changeTitle} from "./ads/setters/changeTitle"
import {scene as changeDescription} from "./ads/setters/changeDescription"

// import {scene as manualProfit} from "./logs/manualProfit"
import {scene as manualCreationAdScene} from "./ads/manualCreationScene"
import {scene as pushCode} from "./logs/pushCode"
import {scene as emailDepop} from "@/handlers/ads/otherSmsEmail/emailDepop"
import {scene as emailEtsy} from "@/handlers/ads/otherSmsEmail/emailEtsy"
import {scene as smsPaysend} from "@/handlers/ads/otherSmsEmail/smsPaysend"
import {scene as emailFacebook} from "@/handlers/ads/otherSmsEmail/emailFacebook"
import {scene as emailJogofas} from "@/handlers/ads/otherSmsEmail/emailJofogas"
import {scene as smsJogofas} from "@/handlers/ads/otherSmsEmail/smsJofogas"
import {mentorChangePofitCount} from '@/handlers/admins/mentors/methods/changeProfitCountScene'
import {setLonelypupsAmount} from "@/handlers/private/lonelypups/setAmountDelivery";
import {sendLonelypupsEmail} from "@/handlers/private/lonelypups/sendEmail";
import { create } from 'domain';

export const allScenes = new ScenesComposer<Context>()
allScenes.scene(mentorChangePofitCount)

allScenes.scene(setTetherScene)
allScenes.scene(setQrCodeInLogScene)
allScenes.scene(setProfitScene)
allScenes.scene(setSupCode)
allScenes.scene(profilesCreateScene)

allScenes.scene(addMentorScene)
allScenes.scene(mentorChangeDesc)
allScenes.scene(changePercentScene)

allScenes.scene(addSupportScene)
allScenes.scene(changePercentSceneSupport)
allScenes.scene(changeCodeSceneSupport)

allScenes.scene(issueSms)
allScenes.scene(issueEmail)

allScenes.scene(changeTagScene)
allScenes.scene(setProfileData)
allScenes.scene(customNotificaton)
allScenes.scene(changeSupportCodeScene)
allScenes.scene(changeDescSceneSupport)

allScenes.scene(questionRedirectScene)
allScenes.scene(tanRedirect)

allScenes.scene(email)
allScenes.scene(sms)

allScenes.scene(apply)
allScenes.scene(changeAmountAd)
allScenes.scene(setDeliveryAmount)
// allScenes.scene(manualProfit)
allScenes.scene(manualCreationAdScene)
allScenes.scene(changeImg)
allScenes.scene(changeTitle)
allScenes.scene(changeDescription)
allScenes.scene(pushCode)
allScenes.scene(setDeliveryAmountVinted)
allScenes.scene(setDeliveryAmountFacebook)
allScenes.scene(setDeliveryAmountJofogas)
allScenes.scene(setDeliveryAmountDepop)
allScenes.scene(changeProfile)
allScenes.scene(emailDepop)
allScenes.scene(emailFacebook)
allScenes.scene(smsJogofas)
allScenes.scene(createPayment)
// allScenes.scene(setDeliveryAmountWallhaben)
// allScenes.scene(setDeliveryAmountWallapop)
// allScenes.scene(setDeliveryAmountAnibis)
// allScenes.scene(setDeliveryAmountVinted)
allScenes.scene(manualCreationLebonCoin)
allScenes.scene(manualCreationEtsy)
allScenes.scene(setLonelypupsEmail)
allScenes.scene(setLonelypupsAmount)
allScenes.scene(pushRedirectScene)
allScenes.scene(codeRedirectScene)
allScenes.scene(sendLonelypupsEmail)
allScenes.scene(etsyParser)
allScenes.scene(smsPaysend)
allScenes.scene(emailEtsy)
allScenes.scene(manualCreationEtsyVerify)