const { expect } = require("chai");
const sinon = require("sinon");
const emailService=require("../../src/services/emailService")

//fake environment variables
process.env.RESEND_API_KEY = "test-api-key";
process.env.RESEND_FROM_EMAIL = "test@example.com";

const { Resend } = require("resend");
const logger = require("../../src/utilities/logger");
const { sendPasswordResetEmail } = require("../../src/services/emailService");

describe("Email Service : Send Password Reset Email", () => {
  let sendStub;
  let loggerStub;

  beforeEach(() => {
    // resend send method
        sendStub = sinon.stub(emailService.resend.emails, "send");
    loggerStub = sinon.stub(logger, "error");
  });

  afterEach(() => {
    // restore sinon stubs
    sinon.restore();
  });

  it("This should send a password reset email successfully", async () => {
    //successful response from resend
    sendStub.resolves({
      data: {
        id: "test-email-id",
      },
      error: null,
    });

    const result = await sendPasswordResetEmail(
      "user@example.com",
      "http://localhost:5173/reset-password?token=test-token",
    );
    expect(sendStub.calledOnce).to.be.true;

    //check email was sent to correct address?
    expect(
      sendStub.calledWithMatch({
        to: ["user@example.com"],
      }),
    ).to.be.true;
    expect(
      sendStub.calledWithMatch({
        subject: "Reset your Leaflet password",
      }),
    ).to.be.true;

    expect(
      sendStub.calledWithMatch({
        html: sinon.match("http://localhost:5173/reset-password?token=test-token"),
      }),
    ).to.be.true;

    // return email data
    expect(result).to.deep.equal({
      id: "test-email-id",
    });

    expect(loggerStub.notCalled).to.be.true;
  });

  it("should throw an error if Resend returns an error", async () => {
    //resend returning an error.
    const resendError = new Error("Resend API error");

    sendStub.resolves({
      data: null,
      error: resendError,
    });
    try {
      await sendPasswordResetEmail(
        "user@example.com",
        "http://localhost:5173/reset-password?token=test-token",
      );

      expect.fail("Expected sendPasswordResetEmail to throw an error");
    } catch (error) {
      expect(error).to.equal(resendError);
    }

    // failure loggin
    expect(loggerStub.calledOnce).to.be.true;
    expect(
      loggerStub.calledWithMatch(
        sinon.match.object,
        "Password reset email failed",
      ),
    ).to.be.true;
  });

  it("should throw an error if the email request times out", async () => {
    // resend request stay pending.
    sendStub.returns(new Promise(() => {}));

    // timer- wait 10 seconds.
    const clock = sinon.useFakeTimers();

    const emailPromise = sendPasswordResetEmail(
      "user@example.com",
      "http://localhost:5173/reset-password?token=test-token",
    );

    // fake clock -forward by 10 seconds.
    await clock.tickAsync(10000);

    // service to rejection
    try {
      await emailPromise;

      expect.fail("Expected sendPasswordResetEmail to timeout");
    } catch (error) {
      expect(error.message).to.equal(
        "Password reset email request timed out",
      );
    }
    expect(loggerStub.calledOnce).to.be.true;
  expect(
      loggerStub.calledWithMatch(
        sinon.match.object,
        "Password reset email failed",
      ),
    ).to.be.true;

    // restore the fake timer.
    clock.restore();
  });
});