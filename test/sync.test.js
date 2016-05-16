import expect from 'expect.js';
import {
  hasError,
  hasSyncStatus,
  isDone,
  isLoading,
  isSuccess,
  sync
} from '../src/sync';
import Immutable, { Map } from 'immutable';
import { getEntity, read, removeEntity, setEntity, swap } from '../src/store/index';

const ID = 1111;

describe("sync", function() {
  describe("when using a string key", function() {
    describe("flow", t(
      {key: "key", key1: "key1", key2: "key2", key3: "key3"}
    ));
  });

  describe("when using an array key", function() {
    describe("flow", t({
      key: ["ns", "key"],
      key1: ["ns", "key1"],
      key2: ["ns", "key2"],
      key3: ["ns", "key3"]
    }));

    it("should care about the values not the reference", function() {
      swap(setEntity, "lock", ID, Map({id: ID}));
      sync(ID, ["ns", "key"], undefined, () => {}, () => {});
      const m = read(getEntity, "lock", ID);
      expect(hasSyncStatus(m, ["ns", "key"])).to.be.ok();
      expect(isLoading(m, ["ns", "key"])).to.be.ok();
    });
  });
});

function t(p) {
  return function() {
    beforeEach(function() {
      swap(setEntity, "lock", ID, Map({id: ID}));
      this.m = read(getEntity, "lock", ID);
    });

    describe("when the sync has not started", function() {
      it("should not have a sync status", function() {
        expect(hasSyncStatus(this.m, p.key)).to.not.be.ok();
      });

      it("should not be loading", function() {
        expect(isLoading(this.m, p.key)).to.not.be.ok();
      });

      it("should not be loaded", function() {
        expect(isSuccess(this.m, p.key)).to.not.be.ok();
      });

      it("should not consider the sync done", function() {
        expect(isDone(this.m)).to.not.be.ok();
      });

      it("should not consider the sync failed", function() {
        expect(hasError(this.m)).to.not.be.ok();
      });
    });

    describe("when sync condition is not met", function() {
      beforeEach(function() {
        const syncFn = () => { this.syncFnInvoked = true};
        const updateFn = () => { this.updateInvoked = true};
        sync(ID, p.key, () => false, syncFn, updateFn);
        this.m = read(getEntity, "lock", ID);
      });

      it("should have a sync status", function() {
        expect(hasSyncStatus(this.m, p.key)).to.be.ok();
      });

      it("should not be loading", function() {
        expect(isLoading(this.m, p.key)).to.not.be.ok();
      });

      it("should not be loaded", function() {
        expect(isSuccess(this.m, p.key)).to.not.be.ok();
      });

      it("should not consider the sync failed", function() {
        expect(hasError(this.m)).to.not.be.ok();
      });

      it("should consider the sync done", function() {
        expect(isDone(this.m)).to.be.ok();
      });

      it("should not invoke the sync fn", function() {
        expect(this.syncFnInvoked).to.not.be.ok();
      });

      it("should not invoke the update fn", function() {
        expect(this.updateFnInvoked).to.not.be.ok();
      });
    });

    describe("when sync condition is met", function() {
      beforeEach(function() {
        sync(ID, p.key, () => true, () => {}, () => {});
        this.m = read(getEntity, "lock", ID);
      });

      it("should have a sync status", function() {
        expect(hasSyncStatus(this.m, p.key)).to.be.ok();
      });

      it("should be loading", function() {
        expect(isLoading(this.m, p.key)).to.be.ok();
      });

      it("should not be loaded", function() {
        expect(isSuccess(this.m, p.key)).to.not.be.ok();
      });

      it("should not consider the sync done", function() {
        expect(isDone(this.m)).to.not.be.ok();
      });

      it("should not consider the sync failed", function() {
        expect(hasError(this.m)).to.not.be.ok();
      });
    });

    describe("when sync condition is omitted", function() {
      beforeEach(function() {
        sync(ID, p.key, undefined, () => {}, () => {});
        this.m = read(getEntity, "lock", ID);
      });

      it("should have a sync status", function() {
        expect(hasSyncStatus(this.m, p.key)).to.be.ok();
      });

      it("should be loading", function() {
        expect(isLoading(this.m, p.key)).to.be.ok();
      });

      it("should not be loaded", function() {
        expect(isSuccess(this.m, p.key)).to.not.be.ok();
      });

      it("should not consider the sync done", function() {
        expect(isDone(this.m)).to.not.be.ok();
      });

      it("should not consider the sync failed", function() {
        expect(hasError(this.m)).to.not.be.ok();
      });
    });

    describe("when a second sync attempt with the same key is made during a sync", function() {
      beforeEach(function() {
        sync(ID, p.key, undefined, () => {}, () => {});
        this.mBefore = read(getEntity, "lock", ID);
        sync(ID, p.key, undefined, () => {}, () => {});
        this.mAfter = read(getEntity, "lock", ID);
      });

      it("should not alter the model", function() {
        expect(this.mBefore).to.be(this.mAfter);
      });
    });

    describe("when successful sync is made", function() {
      beforeEach(function() {
        this.result = {};
        const syncFn = (m, cb) => cb(null, this.result);
        const updateFn = (m, result) => m.set("result", result);

        sync(ID, p.key, undefined, syncFn, updateFn);
        this.m = read(getEntity, "lock", ID);
      });

      it("should have a sync status", function() {
        expect(hasSyncStatus(this.m, p.key)).to.be.ok();
      });

      it("should not be loading", function() {
        expect(isLoading(this.m, p.key)).to.not.be.ok();
      });

      it("should be loaded", function() {
        expect(isSuccess(this.m, p.key)).to.be.ok();
      });

      it("should consider the sync done", function() {
        expect(isDone(this.m)).to.be.ok();
      });

      it("should not consider the sync failed", function() {
        expect(hasError(this.m)).to.not.be.ok();
      });

      it("should have invoked update fn with the sync result fn and updated the model", function() {
        expect(this.m.get("result")).to.be(this.result);
      });
    });

    describe("when a second sync attempt with the same key is made after a sync has succeeded", function() {
      beforeEach(function() {
        sync(ID, p.key, undefined, (m, cb) => cb(), m => m);
        this.mBefore = read(getEntity, "lock", ID);
        sync(ID, p.key, undefined, () => {}, () => {});
        this.mAfter = read(getEntity, "lock", ID);
      });

      it("should not alter the model", function() {
        expect(this.mBefore).to.be(this.mAfter);
      });
    });

    describe("when a failed attempt to sync is made", function() {
      beforeEach(function() {
        const syncFn = (m, cb) => cb({});
        const updateFn = () => { this.updateInvoked = true};

        sync(ID, p.key, undefined, syncFn, updateFn);
        this.m = read(getEntity, "lock", ID);
      });

      it("should have a sync status", function() {
        expect(hasSyncStatus(this.m, p.key)).to.be.ok();
      });

      it("should not be loading", function() {
        expect(isLoading(this.m, p.key)).to.not.be.ok();
      });

      it("should not be loaded", function() {
        expect(isSuccess(this.m, p.key)).to.not.be.ok();
      });

      it("should consider the sync done", function() {
        expect(isDone(this.m)).to.be.ok();
      });

      it("should consider the sync failed", function() {
        expect(hasError(this.m)).to.be.ok();
      });

      it("should not invoke the update fn", function() {
        expect(this.updateFnInvoked).to.not.be.ok();
      });
    });

    describe("when a second sync attempt with the same key is made after a sync has falied", function() {
      beforeEach(function() {
        sync(ID, p.key, undefined, (m, cb) => cb({}), () => {});
        this.mBefore = read(getEntity, "lock", ID);
        sync(ID, p.key, undefined, () => {}, () => {});
        this.mAfter = read(getEntity, "lock", ID);
      });

      it("should not alter the model", function() {
        expect(this.mBefore).to.be(this.mAfter);
      });
    });

    describe("when another sync attempt with a different key is made during a sync", function() {
      beforeEach(function() {
        sync(ID, p.key1, undefined, (m, cb) => { this.cb1 = cb}, m => m);
        sync(ID, p.key2, undefined, (m, cb) => { this.cb2 = cb}, m => m);
        this.m = read(getEntity, "lock", ID);
      });

      it("should have a sync status for the first key", function() {
        expect(hasSyncStatus(this.m, p.key1)).to.be.ok();
      });

      it("should have a sync status for the second key", function() {
        expect(hasSyncStatus(this.m, p.key2)).to.be.ok();
      });

      it("should not have a sync status for another key", function() {
        expect(hasSyncStatus(this.m, p.key3)).to.not.be.ok();
      });

      it("should not consider the sync done", function() {
        expect(isDone(this.m)).to.not.be.ok();
      });

      it("should not consider the sync failed", function() {
        expect(hasError(this.m)).to.not.be.ok();
      });

      describe("when the first sync succeeds", function() {
        beforeEach(function() {
          this.cb1();
          this.m = read(getEntity, "lock", ID);
        });

        it("should not be loading for the first key", function() {
          expect(isLoading(this.m, p.key1)).to.not.be.ok();
        });

        it("should be loading for the sencond key", function() {
          expect(isLoading(this.m, p.key2)).to.be.ok();
        });

        it("should not consider the sync done", function() {
          expect(isDone(this.m)).to.not.be.ok();
        });

        it("should not consider the sync failed", function() {
          expect(hasError(this.m)).to.not.be.ok();
        });

        describe("and the second sync succeeeds", function() {
          beforeEach(function() {
            this.cb2();
            this.m = read(getEntity, "lock", ID);
          });

          it("should not be loading for the first key", function() {
            expect(isLoading(this.m, p.key1)).to.not.be.ok();
          });

          it("should not loading for the sencond key", function() {
            expect(isLoading(this.m, p.key2)).to.not.be.ok();
          });

          it("should consider the sync done", function() {
            expect(isDone(this.m)).to.be.ok();
          });

          it("should not consider the sync failed", function() {
            expect(hasError(this.m)).to.not.be.ok();
          });
        });

        describe("and the second sync fails", function() {
          beforeEach(function() {
            this.cb2({});
            this.m = read(getEntity, "lock", ID);
          });

          it("should not be loading for the first key", function() {
            expect(isLoading(this.m, p.key1)).to.not.be.ok();
          });

          it("should not loading for the sencond key", function() {
            expect(isLoading(this.m, p.key2)).to.not.be.ok();
          });

          it("should consider the sync done", function() {
            expect(isDone(this.m)).to.be.ok();
          });

          it("should consider the sync failed", function() {
            expect(hasError(this.m)).to.be.ok();
          });

          it("should not consider the sync failed if we exclude the second key", function() {
            expect(hasError(this.m, [p.key2])).to.not.be.ok();
          });
        });
      });

      describe("when the first sync fails", function() {
        beforeEach(function() {
          this.cb1({});
          this.m = read(getEntity, "lock", ID);
        });

        it("should not be loading for the first key", function() {
          expect(isLoading(this.m, p.key1)).to.not.be.ok();
        });

        it("should be loading for the sencond key", function() {
          expect(isLoading(this.m, p.key2)).to.be.ok();
        });

        it("should not consider the sync done", function() {
          expect(isDone(this.m)).to.not.be.ok();
        });

        it("should consider the sync failed", function() {
          expect(hasError(this.m)).to.be.ok();
        });

        it("should not consider the sync failed if we exclude the first key", function() {
          expect(hasError(this.m, [p.key1])).to.not.be.ok();
        });

        describe("and the second sync succeeeds", function() {
          beforeEach(function() {
            this.cb2();
            this.m = read(getEntity, "lock", ID);
          });

          it("should not be loading for the first key", function() {
            expect(isLoading(this.m, p.key1)).to.not.be.ok();
          });

          it("should not loading for the sencond key", function() {
            expect(isLoading(this.m, p.key2)).to.not.be.ok();
          });

          it("should consider the sync done", function() {
            expect(isDone(this.m)).to.be.ok();
          });

          it("should consider the sync failed", function() {
            expect(hasError(this.m)).to.be.ok();
          });

          it("should not consider the sync failed if we exclude the first key", function() {
            expect(hasError(this.m, [p.key1])).to.not.be.ok();
          });
        });

        describe("and the second sync fails", function() {
          beforeEach(function() {
            this.cb2({});
            this.m = read(getEntity, "lock", ID);
          });

          it("should not be loading for the first key", function() {
            expect(isLoading(this.m, p.key1)).to.not.be.ok();
          });

          it("should not loading for the sencond key", function() {
            expect(isLoading(this.m, p.key2)).to.not.be.ok();
          });

          it("should consider the sync done", function() {
            expect(isDone(this.m)).to.be.ok();
          });

          it("should consider the sync failed", function() {
            expect(hasError(this.m)).to.be.ok();
          });

          it("should not consider the sync failed if we exclude both keys", function() {
            expect(hasError(this.m, [p.key1, p.key2])).to.not.be.ok();
          });
        });
      });
    });
  };
};

// TODO: we can use some test double to make better assertions about
// the fns that sync calls.
