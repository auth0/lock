import expect from 'expect.js';
import RenderScheduler from '../../src/lock/render_scheduler';

describe("RenderScheduler", function() {
  const originalRequestAnimationFrame = global.window.requestAnimationFrame;
  let requestAnimationFrameCallCounter = 0;
  let requestAnimationFrameCallback;

  beforeEach(function() {
    global.window.requestAnimationFrame = function(f) {
      requestAnimationFrameCallCounter++;
      requestAnimationFrameCallback = f;
    };
  });

  afterEach(function() {
    global.window.requestAnimationFrame = originalRequestAnimationFrame;
    requestAnimationFrameCallCounter = 0;
  });

  it("request an animation frame for the last scheduled function", function() {
    const renderScheduler = new RenderScheduler();

    let f1WasCalled = false; const f1 = () => f1WasCalled = true; renderScheduler.schedule(f1);
    let f2WasCalled = false; const f2 = () => f2WasCalled = true; renderScheduler.schedule(f2);
    let f3WasCalled = false; const f3 = () => f3WasCalled = true; renderScheduler.schedule(f3);

    requestAnimationFrameCallback();

    expect(requestAnimationFrameCallCounter).to.be(1);
    expect(f1WasCalled).to.be(false);
    expect(f2WasCalled).to.be(false);
    expect(f3WasCalled).to.be(true);
  });
});
