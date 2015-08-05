import expect from 'expect.js';
import Immutable from 'immutable';
import * as l from '../../src/lock/index';

let lock;

const clientID = "someClientID";
const lockID = "someLockID";
const domain = "tenant.auth0.com";

describe("initializing a lock", function() {
  beforeEach(function() {
    lock = l.setup({
      clientID: clientID,
      domain: domain,
      id: lockID,
      nonexistent: "nonexistent"
    });
  });

  it("sets the id", function() {
    expect(l.id(lock)).to.be(lockID);
  });

  it("sets the client id", function() {
    expect(l.clientID(lock)).to.be(clientID);
  });

  it("sets the domain", function() {
    expect(l.domain(lock)).to.be(domain);
  });

  it("doesn't set unknown attributes", function() {
    expect(lock.get("nonexistent")).to.be(undefined);
  });

  it("doesn't set any mode", function() {
    expect(l.mode(lock)).to.be(undefined);
  });

  it("doesn't need to be shown", function() {
    expect(l.show(lock)).to.be(false);
  });

  it("isn't submitting", function() {
    expect(l.submitting(lock)).to.be(false);
  });

  it("doesn't have a global error", function() {
    expect(l.globalError(lock)).to.be("");
  });

  it("doesn't need to be rendered", function() {
    expect(l.render(lock)).to.be(false);
  });
});

describe("opening a lock", function() {
  let openedLock;
  const mode = "someMode";
  const modeOptions = {someModeOption: "someModeOption"};

  beforeEach(function() {
    lock = l.setup({clientID: clientID, domain: domain, id: lockID});
    openedLock = l.open(lock, mode, {modeOptions: modeOptions});
  });

  it("sets the mode", function() {
    expect(l.mode(openedLock)).to.be(mode);
  });

  it("sets the mode options", function() {
    expect(l.modeOptions(openedLock).toJS()).to.eql(modeOptions);
  });

  it("needs to be shown", function() {
    expect(l.show(openedLock)).to.be(true);
  });

  it("needs to be rendered", function() {
    expect(l.render(openedLock)).to.be(true);
  });

  it("choses a container id automatically", function() {
    expect(l.ui.containerID(openedLock)).to.be(`auth0-lock-container-${l.id(lock)}`);
  });

  it("can append a container when needed", function() {
    expect(l.ui.appendContainer(openedLock)).to.be(true);
  });

  it("uses the auth0 logo", function() {
    expect(l.ui.icon(openedLock)).to.be("img/badge.svg");
  });

  it("can be closed", function() {
    expect(l.ui.closable(openedLock)).to.be(true);
  });

  // TODO: focusInput test, but remove isSmallScreen dependency first

  it("displays user name and picture obtained from Gravatar", function() {
    expect(l.ui.gravatar(openedLock)).to.be(true);
  });

  describe("with ui option", function() {
    describe("`container`", function() {
      const container = "someId";

      beforeEach(function() {
        openedLock = l.open(lock, mode, {container: container});
      });

      it("assings it as the container id", function() {
        expect(l.ui.containerID(openedLock)).to.be(container);
      });

      it("prohibits appending a container", function() {
        expect(l.ui.appendContainer(openedLock)).to.be(false);
      });

      it("doesn't allow to close it (by default)", function() {
        expect(l.ui.closable(openedLock)).to.be(false);
      });

      // TODO: focusInput test, but (again) remove isSmallScreen dependency first
    });

    describe("`appendContainer`", function() {
      beforeEach(function() {
        openedLock = l.open(lock, mode, {appendContainer: false});
      });

      it("doesn't affect whether a container can be appended or not", function() {
        expect(l.ui.appendContainer(openedLock)).to.be(true);
      });
    });

    describe("`icon`", function() {
      const icon = "my_company_icon.svg";

      beforeEach(function() {
        openedLock = l.open(lock, mode, {icon: icon});
      });

      it("sets a customs icon", function() {
        expect(l.ui.icon(openedLock)).to.be(icon);
      });
    });

    describe("`closable`", function() {
      describe("without `container`", function() {
        beforeEach(function() {
          openedLock = l.open(lock, mode, {closable: false});
        });

        it("can stop the user from closing the lock", function() {
          expect(l.ui.closable(openedLock)).to.be(false);
        });
      });

      describe("with `container`", function() {
        beforeEach(function() {
          openedLock = l.open(lock, mode, {closable: true, container: "someId"});
        })

        it("allows the user to close the lock (even inside a container)", function() {
          expect(l.ui.closable(openedLock)).to.be(true);
        });
      });
    });

    // TODO: focusInput test, but (again) remove isSmallScreen dependency first

    describe("`gravatar`", function() {
      beforeEach(function() {
        openedLock = l.open(lock, mode, {gravatar: false});
      });

      it("doesn't display user name and picture obtained from Gravatar", function() {
        expect(l.ui.gravatar(openedLock)).to.be(false);
      });
    });
  });

  describe("and closing it", function() {
    let closedLock;
    beforeEach(function() {
      closedLock = l.close(openedLock);
    })

    it("doesn't need to be shown anymore", function() {
      expect(l.show(closedLock)).to.be(false);
    });

    it("still needs to be rendered", function() {
      expect(l.render(closedLock)).to.be(true);
    });
  });
});

describe("reopening a lock", function() {
  let openedLock, closedLock, reopenedLock;
  const mode = "someMode";
  // const modeOptions = {someModeOption: "someModeOption"};

  beforeEach(function() {
    lock = l.setup({clientID: clientID, domain: domain, id: lockID});
    openedLock = l.open(lock, mode, {});
    closedLock = l.close(openedLock);
    reopenedLock = l.open(closedLock, mode, {});
  });

  it("doesn't change the container id", function() {
    expect(l.ui.containerID(reopenedLock)).to.be(l.ui.containerID(openedLock));
  });

  it("doesn't change whether it allows to append a container or not", function() {
    expect(l.ui.appendContainer(reopenedLock)).to.be(l.ui.appendContainer(openedLock));
  });

  it("doesn't change the icon", function() {
    expect(l.ui.icon(reopenedLock)).to.be(l.ui.icon(openedLock));
  });

  it("doesn't change whether it can be closed or not", function() {
    expect(l.ui.closable(reopenedLock)).to.be(l.ui.closable(openedLock));
  });

  // TODO: focusInput test, but (again) remove isSmallScreen dependency first

  it("doesn't change whether it displays info obtained from Gravatar or not", function() {
    expect(l.ui.gravatar(reopenedLock)).to.be(l.ui.gravatar(openedLock));
  });

  describe("with UI option", function() {
    const reopenOptions = {
      container: "someId",
      icon: "my_company_icon.svg",
      closable: false,
      gravatar: false
    };

    describe("`container`", function() {
      beforeEach(function() {
        reopenedLock = l.open(closedLock, mode, {container: reopenOptions.container});
      });

      it("doesn't change the container's id", function() {
        expect(l.ui.containerID(reopenedLock)).to.be(l.ui.containerID(openedLock));
        expect(l.ui.containerID(reopenedLock)).to.not.be(reopenOptions.container); // sanity check
      });

      it("doesn't affect whether a container can be appended or not", function() {
        expect(l.ui.appendContainer(reopenedLock)).to.be(l.ui.appendContainer(openedLock));
        expect(l.ui.appendContainer(reopenedLock)).to.be(true); // sanity check
      });

      it("doesn't change whether it can be closed or not", function() {
        expect(l.ui.closable(reopenedLock)).to.be(l.ui.closable(openedLock));
        expect(l.ui.closable(reopenedLock)).to.be(true); // sanity check
      });
    });

    describe("`appendContainer`", function() {
      beforeEach(function() {
        reopenedLock = l.open(closedLock, mode, {appendContainer: false});
      });

      it("doesn't affect whether a container can be appended or not", function() {
        expect(l.ui.appendContainer(reopenedLock)).to.be(l.ui.appendContainer(openedLock));
        expect(l.ui.appendContainer(reopenedLock)).to.be(true); // sanity check
      });
    });

    describe("`icon`", function() {
      beforeEach(function() {
        reopenedLock = l.open(lock, mode, {icon: reopenOptions.icon});
      });

      it("changes the icon", function() {
        expect(l.ui.icon(reopenedLock)).to.be(reopenOptions.icon);
        expect(l.ui.icon(openedLock)).to.not.be(reopenOptions.icon); // sanity check
      });
    });

    describe("`closable`", function() {
      beforeEach(function() {
        reopenedLock = l.open(lock, mode, {closable: reopenOptions.closable});
      });

      it("changes whether it can be closed or not", function() {
        expect(l.ui.closable(reopenedLock)).to.be(reopenOptions.closable);
        expect(l.ui.closable(openedLock)).to.not.be(reopenOptions.closable); // sanity check
      });
    });

    // TODO: focusInput test, but (again) remove isSmallScreen dependency first

    describe("`gravatar`", function() {
      beforeEach(function() {
        reopenedLock = l.open(lock, mode, {gravatar: reopenOptions.gravatar});
      });

      it("changes whether it displays info obtained from Gravatar or not", function() {
        expect(l.ui.gravatar(reopenedLock)).to.be(reopenOptions.gravatar);
        expect(l.ui.gravatar(openedLock)).to.not.be(reopenOptions.gravatar); // sanity check
      });
    });
  });
});

describe("submitting", function() {
  let lockWithGlobalError, submittingLock;
  const globalError = "Something went wrong.";

  beforeEach(function() {
    lock = l.setup({clientID: clientID, domain: domain, id: lockID});
    lockWithGlobalError = l.setGlobalError(lock, globalError);
    submittingLock = l.setSubmitting(lockWithGlobalError, true);
  });

  it("updates the submit status", function() {
    expect(l.submitting(submittingLock)).to.be(true);
    expect(l.submitting(lockWithGlobalError)).to.be(false); // sanity check
  });

  it("clears the global error", function() {
    expect(l.globalError(submittingLock)).to.be("");
  });

  describe("providing a global error", function() {
    beforeEach(function() {
      // TODO: this is confusing, split `setSubmitting` into `startSubmit` and
      // `stopSubmit`.
      submittingLock = l.setSubmitting(lockWithGlobalError, true, globalError)
    });

    it("updates the submit status", function() {
      expect(l.submitting(submittingLock)).to.be(true);
      expect(l.submitting(lockWithGlobalError)).to.be(false); // sanity check
    });

    it("clears the global error anyway", function() {
      expect(l.globalError(submittingLock)).to.be("");
      expect(globalError).to.not.be(""); // sanity check
    });
  });

  describe("a successful request", function() {
    beforeEach(function() {
      submittingLock = l.setSubmitting(lock, false);
    });

    it("updates the submit status", function() {
      expect(l.submitting(submittingLock)).to.be(false);
    });

    it("doesn't record any global error", function() {
      expect(l.globalError(submittingLock)).to.be("");
    });
  });

  describe("an unsuccessful request", function() {
    beforeEach(function() {
      submittingLock = l.setSubmitting(lock, false, globalError);
    });

    it("updates the submit status", function() {
      expect(l.submitting(submittingLock)).to.be(false);
    });

    it("records a global error", function() {
      expect(l.globalError(submittingLock)).to.be(globalError);
    });

  });
});

describe("accessing Gravatar info", function() {
  const gravatar = Immutable.fromJS({displayName: "someName", imageUrl: "someUrl"});
  const mode = "someMode";
  let openedLock;

  beforeEach(function() {
    lock = l.setup({clientID: clientID, domain: domain, id: lockID});
  });

  describe("when it has to be displayed", function() {
    beforeEach(function() {
      openedLock = l.open(lock, mode, {gravatar: true});
    });

    describe("and it isn't available", function() {
      it("returns undefined", function() {
        expect(l.gravatar(openedLock)).to.be(undefined);
      });
    });

    describe("and it is available", function() {
      beforeEach(function() {
        openedLock = openedLock.set("gravatar", gravatar);
      });

      it("returns it", function() {
        expect(l.gravatar(openedLock)).to.be(gravatar);
      });
    });
  });

  describe("when available but it doesn't have to be displayed", function() {
    beforeEach(function() {
      openedLock = l.open(lock, mode, {gravatar: false});
      openedLock = openedLock.set("gravatar", gravatar);
    });

    it("returns undefined", function() {
      expect(l.gravatar(openedLock)).to.be(undefined);
    });
  });
});
