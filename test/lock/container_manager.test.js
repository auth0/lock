import expect from 'expect.js';
import ContainerManager from '../../src/lock/container_manager';

describe("ContainerManager", function() {
  const originalGetElementById = global.document.getElementById;
  let getElementByIdWasCalled = false;

  beforeEach(function() {
    global.document.getElementById = function() {
      getElementByIdWasCalled = true;
      return originalGetElementById.apply(global.document, arguments);
    };
  });

  afterEach(function() {
    global.document.getElementById = originalGetElementById;
    getElementByIdWasCalled = false;
  });

  describe("when getting an element that exists in the dom", function() {
    let containerManager;
    let element;
    const id = "existentId";


    before(function() {
      containerManager = new ContainerManager();

      element = document.createElement("div");
      element.id = id;
      global.document.body.appendChild(element);
    });

    after(function() {
      global.document.body.removeChild(element);
    });

    it("returns it by asking the DOM for it", function() {
      expect(containerManager.ensure(id)).to.be(element);
      expect(getElementByIdWasCalled).to.be(true);
    });

    describe("when getting it again", function() {
      it("returns it but it doesn't ask the DOM for it", function() {
        expect(containerManager.ensure(id)).to.be(element);
        expect(getElementByIdWasCalled).to.be(false);
      });
    });
  });

  describe("when getting an element that doesn't exist in the dom", function() {
    describe("that can be created", function() {
      let containerManager;
      const id = "nonexistentCanBeCreatedId";

      before(function() {
        containerManager = new ContainerManager();
      });

      after(function() {
        global.document.body.removeChild(global.document.getElementById(id));
      });

      it("appends a div with the given id to the body and returns it", function() {
        const result = containerManager.ensure(id, true);
        expect(result).to.be(global.document.getElementById(id));
        expect(result).to.be.a(HTMLDivElement);
        expect(result.id).to.be(id);
      });

      describe("when getting it again", function() {
        it("returns it but it doesn't ask the DOM for it", function() {
          const result = containerManager.ensure(id, true);
          expect(result).to.be.a(HTMLDivElement);
          expect(result.id).to.be(id);
          expect(getElementByIdWasCalled).to.be(false);
        });
      });
    });

    describe("that can't be created", function() {
      let containerManager;
      const id = "nonexistentCantBeCreatedId";

      before(function() {
        containerManager = new ContainerManager();
      });

      it("throws an error", function() {
        expect(function() {
          containerManager.ensure(id, false);
        }).to.throwError(function(e) {
          expect(e).to.be.an(Error);
          expect(e.message).to.be(`Can't find element with id ${id}`);
        });
      });
    });
  });
});
