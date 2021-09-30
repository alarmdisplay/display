import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, DisplayData, ViewData } from '../../declarations';
import { Id, NullableId, Params } from '@feathersjs/feathers';
import { Forbidden, NotAuthenticated } from '@feathersjs/errors';

export class Displays extends Service<DisplayData> {
  private app: Application;

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  get(id: Id, params?: Params): Promise<DisplayData> {
    // Enable a connected Display to retrieve its own record by using the ID 'self'
    if (id === 'self') {
      if (!params || !params.authenticated) {
        throw new NotAuthenticated();
      }

      if (!params.display || !params.display.id) {
        throw new Forbidden('Only a Display can query itself');
      }

      return super.get(params.display.id, params);
    }

    return super.get(id, params);
  }

  async _patch(id: NullableId, data: Partial<DisplayData>, params?: Params): Promise<DisplayData> {
    await this.diffViews(id as number, data.views);
    return await super._patch(id, data, params);
  }

  async _update(id: NullableId, data: DisplayData, params?: Params): Promise<DisplayData> {
    if (data.views && data.views.length) {
      await this.diffViews(id as number, data.views);
    } else {
      // The views are intentionally left empty, remove all existing ones
      await this.app.service('api/v1/views').remove(null, { query: { displayId: id } });
    }

    return await super._update(id, data, params);
  }

  private async diffViews(id: number, submittedViews: ViewData[] | undefined) {
    const ViewsService = this.app.service('api/v1/views');

    if (submittedViews && submittedViews.length === 0) {
      // Shortcut: No views should be assigned, so delete any that belong to this display
      await ViewsService.remove(null, { query: { displayId: id } });
    } else if (submittedViews && submittedViews.length > 0) {
      // Get the currently assigned views
      const currentViews = await ViewsService.find({
        query: { displayId: id },
        paginate: false
      }) as ViewData[];
      const currentIds = currentViews.map(view => view.id);

      // Patch views that have IDs, create the others
      const patchedIds: number[] = [];
      for (const submittedView of submittedViews) {
        submittedView.displayId = id as number;
        if (submittedView.id) {
          const patchedView = await ViewsService.patch(submittedView.id, submittedView) as ViewData;
          patchedIds.push(patchedView.id);
        } else {
          await ViewsService.create(submittedView);
        }
      }

      // Remove all assigned views that were not patched
      const removedIds = currentIds.filter(id => !patchedIds.includes(id));
      await ViewsService.remove(null, { query: { id: { $in: removedIds } } });
    }
  }
}
