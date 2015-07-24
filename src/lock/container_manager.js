export default class LockContainerManager {
  constructor() {
    this._containerCache = {};
  }

  getLockContainer(lockID, containerID, fromCache) {
    if (fromCache) {
      return this._containerCache[lockID];
    }
    return this._getContainer(lockID, containerID, () => {
      if (containerID) {
        throw new Error(`Not found element with id ${containerID}`);
      }
      return this._appendDefaultContainer(lockID);
    });
  }

  _getContainer(lockID, containerID, callback) {
    var f = () => {
      var container = this._containerCache[lockID];
      if (!container) {
        containerID = containerID || this._getDefaultContainerID(lockID);
        container = this._containerCache[lockID] = document.getElementById(containerID);
      }
      return container;
    };

    return f() || callback(lockID, containerID);
  }

  _getDefaultContainerID(lockID) {
    return `auth0-lock-container-${lockID}`;
  }

  _appendDefaultContainer(lockID) {
    var container = document.createElement('div');
    container.id = this._getDefaultContainerID(lockID);
    return this._containerCache[lockID] = document.body.appendChild(container);
  }
}
