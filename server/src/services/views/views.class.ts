import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, ViewData, ContentSlotData } from '../../declarations';
import { NullableId, Params } from '@feathersjs/feathers';

export class Views extends Service<ViewData> {
  private app: Application;

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async _patch(id: NullableId, data: Partial<ViewData>, params?: Params): Promise<ViewData> {
    await this.diffContentSlots(id as number, data.contentSlots);
    return await super._patch(id, data, params);
  }

  async _update(id: NullableId, data: ViewData, params?: Params): Promise<ViewData> {
    if (data.contentSlots && data.contentSlots.length) {
      await this.diffContentSlots(id as number, data.contentSlots);
    } else {
      // The content slots are intentionally left empty, remove all existing ones
      await this.app.service('api/v1/content-slots').remove(null, { query: { viewId: id } });
    }

    return await super._update(id, data, params);
  }

  private async diffContentSlots(id: number, submittedContentSlots: ContentSlotData[] | undefined) {
    const ContentSlotsService = this.app.service('api/v1/content-slots');

    if (submittedContentSlots && submittedContentSlots.length === 0) {
      // Shortcut: No content slots should be assigned, so delete any that belong to this view
      await ContentSlotsService.remove(null, { query: { viewId: id } });
    } else if (submittedContentSlots && submittedContentSlots.length > 0) {
      // Get the currently assigned content slots
      const currentContentSlots = await ContentSlotsService.find({
        query: { viewId: id },
        paginate: false
      }) as ContentSlotData[];
      const currentIds = currentContentSlots.map(view => view.id);

      // Patch content slots that have IDs, create the others
      const patchedIds: number[] = [];
      for (const submittedContentSlot of submittedContentSlots) {
        submittedContentSlot.viewId = id as number;
        if (submittedContentSlot.id) {
          const patchedContentSlot = await ContentSlotsService.patch(submittedContentSlot.id, submittedContentSlot) as ContentSlotData;
          patchedIds.push(patchedContentSlot.id);
        } else {
          await ContentSlotsService.create(submittedContentSlot);
        }
      }

      // Remove all assigned content slots that were not patched
      const removedIds = currentIds.filter(id => !patchedIds.includes(id));
      if (removedIds.length) {
        await ContentSlotsService.remove(null, { query: { id: { $in: removedIds } } });
      }
    }
  }
}
