/// <reference types="@altv/types-natives" />
/// <reference types="@altv/types-client" />
import alt from 'alt-client';
import * as native from 'natives';

const player = alt.Player.local;

let crawlInterval;
player.crawl = false;

alt.on('keyup', key => {
    if (key === 90) {
        // z
        if (player.crawl) {
            alt.clearInterval(crawlInterval);
            native.clearPedTasks(player.scriptID);
            native.clearPedSecondaryTask(player.scriptID);
        } else crawl();
    }
});

function crawl() {
    crawlInterval = alt.setInterval(handleControls, 0);
    player.crawl = true;
    native.requestAnimDict('move_crawlprone2crawlfront');
    native.taskPlayAnim(
        player.scriptID,
        'move_crawlprone2crawlfront',
        'front',
        8.0,
        1000,
        -1,
        2,
        0,
        false,
        false,
        false
    );
}

let anim;
let timeoutAnim;

function handleControls() {
    if (!player.crawl) return;
    let dict = 'move_crawl';
    let rotation = native.getEntityRotation(player.scriptID, 2);

    native.disableControlAction(0, 32, true); // w
    native.disableControlAction(0, 33, true); // s
    native.disableControlAction(0, 34, true); // a
    native.disableControlAction(0, 35, true); // d
    if (native.isDisabledControlPressed(0, 34)) {
        native.setEntityRotation(player.scriptID, rotation.x, rotation.y, rotation.z + 0.1, 2, true);
    }
    if (native.isDisabledControlPressed(0, 35)) {
        native.setEntityRotation(player.scriptID, rotation.x, rotation.y, rotation.z - 0.1, 2, true);
    }
    if (native.isDisabledControlPressed(0, 32)) {
        if (anim === ('onfront_fwd' || 'onfront_bwd') || timeoutAnim) return;
        anim = 'onfront_fwd';
        let timer = native.getAnimDuration('move_crawl', anim);
        native.requestAnimDict(dict);
        native.taskPlayAnim(player.scriptID, dict, anim, 8.0, 1000, -1, 2, 0, false, false, false);
        timeoutAnim = alt.setTimeout(() => {
            anim = undefined;
            timeoutAnim = undefined;
        }, (timer - 0.1) * 1000);
    }
    if (native.isDisabledControlPressed(0, 33)) {
        if (anim === ('onfront_fwd' || 'onfront_bwd') || timeoutAnim) return;
        anim = 'onfront_bwd';
        let timer = native.getAnimDuration('move_crawl', anim);
        native.requestAnimDict(dict);
        native.taskPlayAnim(player.scriptID, dict, anim, 8.0, 1000, -1, 2, 0, false, false, false);
        timeoutAnim = alt.setTimeout(() => {
            anim = undefined;
            timeoutAnim = undefined;
        }, (timer - 0.1) * 1000);
    }
}
