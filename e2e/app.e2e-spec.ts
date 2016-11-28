import { VideoCenter4Page } from './app.po';

describe('video-center-4 App', function() {
  let page: VideoCenter4Page;

  beforeEach(() => {
    page = new VideoCenter4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
