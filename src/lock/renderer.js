import { remove, render } from '../widget/render';
import * as l from './index';
import * as c from '../cred/index';
import * as g from '../gravatar/index';
import { getCollection, getEntity } from '../store/index';

export default class Renderer {

  render(state, fns) {
    const locks = getCollection(state, "lock");

    locks.forEach(lock => {
      if (l.rendering(lock)) {
        const gravatar = getEntity(
          state,
          "gravatar",
          g.normalizeGravatarEmail(c.email(lock))
        );

        lock = lock.set("gravatar", gravatar && g.loaded(gravatar) ? gravatar : null);
        const screen = fns[l.modeName(lock)](lock);
        const props = {
          auxiliaryPane: screen.renderAuxiliaryPane(lock),
          backHandler: screen.backHandler(lock),
          closeHandler: screen.closeHandler(lock),
          contentRender: ::screen.render,
          footerText: screen.renderFooterText(lock),
          headerText: screen.renderHeaderText(lock),
          lock: lock,
          screenName: screen.name,
          submitHandler: screen.submitHandler(lock),
          tabs: screen.renderTabs(lock),
          transitionName: screen.transitionName(lock)
        };
        render(props, l.ui.containerID(lock), l.ui.appendContainer(lock));
      } else {
        remove(l.ui.containerID(lock));
      }
    });

  }
}
