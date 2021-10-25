import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, SettingsData, SettingsValue } from '../../declarations';
import logger from '../../logger';

export class Settings extends Service<SettingsData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }

  setup(app: Application): void {
    const settingDefaults = new Map<string, SettingsValue>([
      ['alert_banner_message', ''],
      ['incident_display_minutes', 60],
      ['incident_test_display_minutes', 1],
      ['station_coordinates', null],
    ]);

    (app.get('databaseReady') as Promise<void>).then(async () => {
      logger.debug('Checking the settings table');
      for (const [settingKey, settingDefault] of settingDefaults) {
        try {
          await this.get(settingKey);
        } catch {
          // If the setting cannot be found, create it with the default value
          await this.create({ key: settingKey, value: settingDefault });
        }
      }
    });
  }
}
