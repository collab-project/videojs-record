/**
 * @file record-indicator.js
 */

const Component = videojs.getComponent('Component');

/**
 * Icon indicating recording is active.
 * @private
 * @class
 * @augments videojs.Component
*/
const RecordIndicator = videojs.extend(Component,
{
    /** @constructor */
    constructor: function(player, options)
    {
        VjsComponent.call(this, player, options);

        this.on(player, 'startRecord', this.show);
        this.on(player, 'stopRecord', this.hide);
    }
});
RecordIndicator.prototype.disable = function()
{
    // disable record indicator event handlers
    this.off(this.player(), 'startRecord', this.show);
    this.off(this.player(), 'stopRecord', this.hide);
};

export default RecordIndicator;
