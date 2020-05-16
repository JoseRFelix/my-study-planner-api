import config from '../config'
import EmailSequenceJob from '../jobs/emailSequence'
import * as Agenda from 'agenda'
import NotifierJob from '../jobs/notifier'

export default async ({agenda}: {agenda: Agenda}) => {
  agenda.define(
    'send-email',
    {priority: 'high', concurrency: config.agenda.concurrency},
    new EmailSequenceJob().handler,
  )

  agenda.define(
    'send-morning-notification',
    {priority: 'high', concurrency: config.agenda.concurrency},
    new NotifierJob().handler,
  )

  agenda.define(
    'send-night-notification',
    {priority: 'high', concurrency: config.agenda.concurrency},
    new NotifierJob().handler,
  )

  agenda.start()

  agenda.every('00 08 * * *', 'send-morning-notification')

  agenda.every('00 20 * * *', 'send-night-notification')
}
