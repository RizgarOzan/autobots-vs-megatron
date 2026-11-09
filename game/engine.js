// GENERATED from Boss.dc.html: same moves, numbers and sprites as the canvas card. Don't edit by hand.
class DCLogic { constructor(p) { this.props = p || {}; } setState(s) { Object.assign(this.state, s); } }
// the card waits between enemy moves; here turn.js calls enemyTurn() itself
const setTimeout = () => 0, clearTimeout = () => {};

// sprites are tools/sprite.py output (native px); they are drawn at 2x with pixelated scaling
const SPR = {"bb": {"src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAABgCAYAAACwu0pzAAAQaElEQVR42s1cbWxTZ5Z+bBzbCZETJXYakzgfdYa00HgoWUXR0k6HdFWy6tKIaIpEU7UMNMNUGnZmtaJSQzXSqpD9Ec2PmY40aplChQjRdCWQS+gAMziEthpESzLjkADdOE4cgpPYZe0oH/YN4P1x/b5+3+t77Wtj2r6SFccf997znnOec85zzrUGj3CZCstj7P8Li7Mapfel72WzNADwv7du5OTiGxu3xqSvjfY7AAAb/80t+50z3XZs7/Lg2rWBhxLmB/VPQpdrbbAXP9rvQKXxAgAg0C++f8W9Bdu7PACAoSP34XZdBVCak3NrH4V5VZoGcabbjqh/GEIEECLAtN8CAGh2fIEz3XYE+mfhdoVQ2tCUs/PmXDMT7iVUPgNUWL6GzRqgr9usAehNBirQtN+Cty+ug7/Pk7Nz51wz27s88NwywV6/gGm/hT4AAEIUEKLQGwG3K4Sn10YA4KH95ZEIw17U5c//CT0nKmCwPo2ZwHq89bdf41cDv4bHKwq2Y+8qDnXdzelG5lQYgmb22gBOLT0P4zMvIWL9LU4tPU8/MxNYT5/bawOKKPi98JnRfgeEyCwOvrEbABC8PQIAOPjGbgRvjyDw2UUIEUBvBEW0zZ1rvp8+M+FeSnptX2sjfW559i3qQ0KE19T3TjPbuzwY7X8B0btRmEoMMFc2YOFulL7//rlraF+7Hm5XCACwO4dopstltCfrUM883v3IgIW4QKYSAzW3fa2N6PzJWTz1xEZsWzfKHe9hUS3jdIYVgkR7Yl6PO9Yi6h/O+CIM1qcV0510qKk6nVHa/TPddvyo6QsAsxDEUIEyIpdV+XjE6VkAEPfzAsJ/BTxeC2YC67G9y4Ndz5Xj+k0RGIKxe/BNTaKqugb++bnszeynB3+Gr/54VoziBYsAxOguvcBs1q7OejjHZtG2oRwAUFSVj+s3I2h4rALXbyY+Z9bo4APgm5pEXn6+okmmRbPI55/Q59PLhZheLuTSlGyXEAGcY7Po3bOMoqp8TC8XUk2k29ysNSM9ga1gkdOGEAHO9uYpft/RUkyDI7um/Ra0bSgBMIFLN2Iwq3T9uZN/yl2cKarKl/WDTJfbFUJRVT7O39kIsyY9qFZV11Dr+FZLAE6TKUyShebvJANIdQGOlmLur5zmCPqxKxi7h2DsXsrzmjU6bK6pS4m02myCYirTYf+mg2h2+aYmVZ9HCQS02SLHwy5We6yGUi3yPkHY1eWv6SNnPvNix6rqC1YyIbUrGLuHvsHZzKH52OEPuKCZymx27F3lan0RjgNpTfJ3B/6Os715ePviBvimJmFm/EKqLRI0AeDKZ++rD5okwh47/AFG5mYwNDme1gz0RlEIubgi9RdHSzEcLcXQG8XnpIQm5yDnM2t0nOZSmb5WTUJHDkCc9PLVLbh8dQs8XossOrHI5fFa4PFacPnqFq5slsL3zuYJtG0oh29qEiNzM0nmR56zGUnWJUBVdU38gG6cWnoev2h/BTHE8NapvqxSGZs1QE2SaGtn8wScYwUAgNdaa3HphqgZW8EippcLUVVdg0s3YplrprFxa4zAc+TzT+jOnL+zUcwESvQoKjFgX2sjrSTPHXHi3BFnSkHem3yTCkD8RogkQIQknayTTy8X0iSXmGPzs/tiGWlm6Mh92GsDECKzuOLegpPnlxD2rYCEiXC8gnz/3DUAQGtnW1ZaIsKJAk3gU28pNa2nnriPV7atRYXFB5s1gAd1O7HpR7fgn59D87P7YiwQ6NKxLACgNxnQ1F6BpnZg5rMBvDcpEhVEiEzWL9pfwfTQH2CzBuIAEOAEKm1oAvo8tPAz14nwbpz/CoABkbh2nq4twqfeMCeQVkmQQP8soDcgUrkTkbI2GOedMN7+GADQvvZi1oIUleipqdlrA/B4LVxGQHhoc10xI4hTJBCZZPdQ110MHbmf3mdG+x14UCcRQogCegPe6S7BNyNXsw6wh//4kezrHq8FRf9STv83zjt5QfQGRMraZJNY4j9aOa3I74gGnlsmOMdmsxLi4Bu78ftTJ+n/V9xbKKr9/N1NeKe7hAsH9MIZjbDJrs0agN7I8xBapZYEJ4jegEjly+g5UZG1IOG7Avcay3IeP+dNqpNY7Ui1UtrQRGGdJVC0Uq1UmgZhvP0/vCBlbQiOh3D8nBcjJ/RwtBSjfe1F1X4CgNMKu17fX58ExQmoi8oKWGH5WjYz1yVpRfgLgBigF9sPZEe+7B1A7x7AXhtO5G5dHny06xsusWQZygrL1zD4r2BhaBj7a5LzMseRHyqm/nJaIdZiswaAFguAQNxvyhPCEK2U4QKFyQeViQMIC1EAedixd5XjugA3FeCbkavoOVGBsC/IXFIJgKn430TJHfaVYHjJSOmj/35+DI4WPTZ3rknUUYKQLByjKbkKVsdqRW/6P7oLwfEQKk2DEBaiONubhx17+SSTtvlMg7DXfwXBsQqHf4ZCLptBk5NP+y3cRby+vx6Huu7AXrsKIIAz3YkWoRCJQW/UyAKB3pgItuQcpsLymJZ0fM11xZyTVZoGuQMIkRgHo5xpL0RpxsxGdZs1wGXRBIHI41DXXc72WT5OvGp9wjri7URpW5FNhLVSmlWq0mm/hRZZ5EDELypNg0lpiVwCyUZ4dtlrgzTXY9lSdscTZg5uI2zWQFLGriU8cXA8JGubxGzIhZztzYsz/Q7Zml6JepJ/PUYJEiEiAsPJ80vUJ4mlEAGUjknKAi1JIQ7sn8JP//UfOP2HB5wZsaZztjePdocn3Evw3DJJTDFZ+HT1DgCc/jAPr++vR8fRAlXwzH7/xYPrEpohkxFFVfkYXjLiNy4HGl4VsKuzHqc/zKMn/PeeTXj74gbqoNu7PHC7QrRAS0UGytFNHq9Flgll4w2FZyjTVb6pSYR9KyKaEQC4fnMNzJo4OV5TB+fYOJxjBWi7ImK4c8yLnx36JY4d/gDXrg1oCIS6XSG4kQdHS3ESXEq14vFaGIcPwdFSDLcrhPN3NsI55k1Cy7mbbdRnpv0W+tmwb4XJGLxxljMsQjNLWkjpT8LSV1XX4NjhD7j3zt/ZiEs3YvGCaQJosVDEYrWSECJEvxf2reA3rkIMTQoAvLIamPlsAD0nnkTYtxLPCQsSnx0TC7nePcv4+MoiRojPRD7/BMHYPQxNjsNWsJhEXHzqDdO+CNtKCPtWYNboMLxkRMfRAjS8KuD1/aJ5erxi///0h3noOVGB0oYmdBwtQMfRAly6EaObRjhk2uZ4rpzrTJPPEjaTZTWdY7M4f2cj3uw0i6mwqbA81vBYBW3obK6po88BUGpH2g9pbNwaa3isIokSkktPXmutRd/gLNjPcxXt5Dh9vrmmjhIabMOJnMOs0dHrI9fGQfNTT9znuFyzRoeq6hpUVddwO5UrIk+J4ZcKxnbOiCByDNK1awOahcVZjZYgCNkNssNSvkqW4Y+TDOkEMj7zEsimZbMRvqlJVVy0dmFxVkNMaGRuJomUUKJC5Xo1cj5AiERWKCXtyH03GLuHquoaajWsCxC+OamekTKY5JFuUEeqnXR0byZrZG4GP35Sw108cQF2EYF06VrSqZbxmZcQTtGWkx67sXFrjBB6cqYmR//2Dc5SR2fpWn9+/rffOVNjmlLfIVkwcW6iJf/8HGcxUvJc9zDTGXMqtSLVps33p5S9SWnXQcliWH/JSjNEkF3PldMLshUs0ocSMpHvsX4j529V1TUUnjPt3mmzEYSk/8T+yUMJpUisIjvMcsfsRrDCWcsewyNv0I72O2CuK8bvDvwdO5snuAuRE8g3NSk7SyBdZEOIZgmCZaKdjIUhBKHeZICjpRg971XT3Egur5PrVbLapFMf8Q1hA+vqykpGAmmzmWYiabnNGkAZLuBxx1oc+/MP8WanmUuFSDyQRm+paRFNFVXl48CrM+jdsyybeCKX82aj/Q6urNabRE7LHGdzWv/juqoNIfD8yra1OHl+CdvWjXJjKW4kirZUzaWHEibqHwaMvCCkGvyy90G83ki9ho7ch73+BmVJt8VJeKU+qFx2TFZewXr5dAaZjI7oDbi98FxCS0IUH195XNUx7LVBSlRUmgY55idVy12N32gz8Re9MUGXluEC1yEg41bpUvxI5ctcfW+zBpI2wl4b5P5XqoOyBoDRfgcVxDjv5Epjj9fM9TtTpfjB8ZBIzMcpWL1Rw/FkhIIivU1pjZMzaCaCEFKOJcLZk6f1uzhTCcQAxGTztZ3NE482aBLT4HcxcXJC+UgXGztEwp3nw1JNSr3WWqvab1QLU2n8C3VcmzVASQuWMFRKaZIKPBliT9pvkc7jqPEbrepgqddT9CJtbrcrxF3Ef7a40057yI38yiEa8aWwbwVtG8rTjrqo1gzllSVthR17V1VPLsml8oSIT2diRVX5qjgAneobfJqiirGHRGwRYtM3cE9/KKVlQ9QXafDU60VfilPJx1UEZFXCJPVNHnLgtLShCc2OL7hJWmlQjpS1obRhJqlNn2rMPqdls1xbXY5x2d7l4XotpCEl3Zim9gpFtvORCJPK5gHgx09qkBFpwgRmtgvQtqE87RC3qqmmVBctF3Oy3gRJvz9S1kYBpqgqXzYTyCtYD1WDQOJ9lmIrXYo8UpMQUxkv3cVEBB9Fn8x9mJyzx/M7rkVO/5poYE0HArp05THm9TS2SCGV9EzIybbtofiHTO98kSagJBSwaJkOBLTqUm1NEoKd7c2j8y7ZLJrWxEdZ5ASRWsBrrbW0gavaZ7j5GZK2xyc2AA1+/u4mdBwtyCoZBNMZI+NfCQGEpMklSAaAUoUJrVJmS+sVIZpI2fUGXL76zzh+zqtYu2R7Z5Jx3olI5cuy3W61xZrsiJa9fgHSFjeEKISFaNo6P5Nx/OB4iINgUl4QnySJLJv/uV0hRVPTyt2CReZWpPBJusNqaxfpoILcDd1E++ytwuzggs0awIsdfA5ITI1sEIHnpBGtpvYKOlpCepKkPU769Jn6Cmm3Z3rThDRLIAK5XaGkqRLZES3jvBOCTK3hRp4kfjycn4z2OxApK1bu+QtCvBLlR1lsHaKFyN3cqkvNpIhfZuNJJmt3X6nq6hWCIJbTEiH0JoNYZQtROjzhaCnGO91BdcJIR0Vs1gB67myCc8yLnc2ZCZEqFxNRMiZbgRJBWG6OXcNLRgBhZWGi/mF4/Cb0nKjAgVdn6ICCx2vB8XPeeAY8ppjWs76hrgsXS0ugKOV0Zo0O/nSacbtC2LYuBLeLpUlDAAro6LqsEPF7lNW2EifcS4haLLKmLZqTBpBojh2aS5ubbe5cgzPdTfQnI1hfkTp/tkKw8CqlZPkLjcm+N48X4HYNIBhbpywMaaCKprIGQDnOdNvxYscX8ZI4N0JIU34uk/bGf64i/pddZGb0y/86rU4z7IUlBCvHaL8Dn3rd4g0HuRAinmjeliQaFc8WIwKgogyISDKF6K0B7rNy9zjr0sWFxsatMUIP5eqHO0Qe7kLyi7flfaIMAKzJhaD0enTZJIW5WHJ3OEmBAN/1LzUgw3s6FVcLX4myGlMKxt+ZMCz9KscjuF2h+FR5cihAn/xvO31nwszjBQYM5ILwEmxWnlsjP3yQ8mcnvu0l/amwTJfSz4f9PyGll26aiaJ9AAAAAElFTkSuQmCC", "w": 98, "h": 96}, "gl": {"src": "data:image/png;base64,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", "w": 104, "h": 132}, "hr": {"src": "data:image/png;base64,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", "w": 98, "h": 111}, "meg": {"src": "data:image/png;base64,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", "w": 135, "h": 154}, "sw": {"src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAACACAYAAADwKbyHAAAO6ElEQVR42u1dXWwU1xX+djVJVbrZ4GKQi8KGKKQVDQWqgkp4ACqk2H2oWFtETtI2Djy0vEDkCgWMERbIxI6EZCV9KS8QUrVKVGSbp8SRogCRIBFQAXEUVUGqtSCKiqldZ3Gkpqr7YM5w5s65M3dm7/7MmitZttfrmdn73XPOd/7uTaGKI5tpmpFenyreSmGOjXS1HyC38gDmzV8BAO53HUD1PFLVlgKafBqNuTYUrh6ac9KRrqYU5FYecCefxnhh0CMlc0U6qqaa+ORLrzfm2lygTKSMfz0AIsIYLwxqf+a/m0w+qTgCLolgONWUiPHCIIYzRd/f8sWMkZ3JrTyA8cKge63xwiDmzV+B6clRZDNNM0myL6lKU1NuoAmEvju3AQBdCxZ6wCDDTRPKr0kg6Mb05GiijH3KxsSqH5avWK56aHLmzV+B/s48hvoHAAAHh/8MAOjJv+he4/vP/wJ/HBrF9OQopoq3UnTNpfN/AAD4Jx7ySZfEvuoKCK6H+YdWqSaBks00zXAQVFbU35nHiZNDGDjymvae23fsBABc+3vBI0nDmWKo6koiEI4pCKoqoMnlzKZw9ZD7fg6WapBNxqOZR9CxtRW7eno998iXeN1ESoQkCTraKTEgHU3l73n/3cPidTp37wMAfHE95Zl0kghJHdWtjeAqhk9iEBicxQT5Cyoo7797GC3t3T6AWtq7fapNVU8SKGRbEu9HqMY5igrgYBGtpP9Xf6f3EQhhwNEgxqUDoW5UkyoNkn0IU0uf9HqN6rr9Rc9r6/YXtQ9GEqJTbQQEqSmyUUmNUaWjeMGmq5Xeq070Inzj/rzn+JfY+OQ/8Elvxv3igyRE8sAbc23IFzP4TfFbWIRvULh6yAVhqngrlcRAoWOqZqKyk/HCoG9yaWw7+hUGjhybBWTfdvf1jU8Cr297yictHAB6nsZcG8bqKErrmOr6KNJwXyIGtWqKRtdrxzy/EzASKKrtqafhRF3lKiAqWDr6OgvKQ6H3+M8jP0T/G7Me957tzQIoTE0y25C02JIREFI4g7MePsl8hQZJTVT1tveVTvQwaVElhQOSW3nA5+HXjUScHTkVSiu5/YhjR6TR07UbL+TbcOwPv9eqsD37tuOT3vsSQs+mLqBE+xH0YcizDUvimHjbccb2HTuxfcdOvNT+qmhX9hz/0rU9FP6mnATPSyQlNyHS1zcP7nd/fmZ1Q2iyhv7OVVWpY/Om9di8aT2aW3/sBgB1Q6K/KiCJAiLogcP0v6mtsDW4VCAkP54EMJwgaYgayjCluYsevlXRD0lZu8QZa54r6Ona7QnGRaW1cSXkw9PnjN6neu/S/RpzbSjUePrUMVFLz6xuwPnL8oqXEj9hkvH6tqc8HrXq1KmMKcxGmDh5tS4Vjola6una7YsBmYAihSWI/xP9VMMcJsCohppT2DnhWQP38wQH+47g/OVBIyMt5Se84Y+nxDCHBEq9DqcUx6ulvTtUFZmoKlXP66SFQDnYdwQA8LAh6IkBIi61m7UdE4Eg6OyHpNbkYKEflP5jIwCAA/diUUFUW60gqXmJoDKVOFIRJgVqGNs0t61KC4FCwUAKBAbdn9+zlkMeTjlKKdUVKU1yWFGBxITug/I915Net78oEgR+zSSkTl0gftf5nPviv4tfxa5lVY131KyeCShcfZnmJ2o9AOhUUgqiGNAgGxLlWuTM1X0R8vTkqKfZROdllxq51YVSJPsTt/qkqkCojOnNt94uuczetPJDUithwEh+S1hAspCA6vC06lHvevklxC2zl9STSYEZvU9XCxUlxiW9h5JcfNGpzS3Vjs465WpCCasGlOqXdJRWkhiXCRmoQWA247iheYuvtJ8zK/63SkuPA8xGWzu2tqIcLVmSIVfrXQkM9XXVRwliSCZV5gSG1DLAezaevTFWcVXmAMCd6/+NfYGzI6c8xWBhkiAVHc9GV7M+MCRgXBWmgNLfmTd+3g3NW3xGnncuffDYUjx7Y6z6qdJHM48YX4DiPqbSEpbboFx1WFqWDw5Cx9ZWT749qDAiqH2s0lm9tOrM0Yfpyb/odvDwTh5diDwKFVXBuDmRdVf6zYksbk7MSocEyuKGKbz/7uFAQ24CBl8cUuNLpduLfcaa2qmon60n/yK6Fiz0gUHtVpIvYZKfkGwCV10t7d24OZEVgZPK+HVgBHUlecCQiILQEVURIIb6B9C1YCH67tx2GwwBudkwSEpMDToHY7wwiMUNU1oDHgcMG33fJBXlNtyOKgV9d25jatlScSVJk9+1YCE+unE3MF2qyw+QzZCo60vtr2KR4aTrWF8UqUCVU6ypbKZp5oPHlrorv3VvZ2ijIR8bmrf4qKA6saY5bUnvc/XV0t6NxQ1TbuqUgyixphMnhwAA8xd815PuVVlY2OAl/2UHgkCgsXdgOHBSOBBkHzgAy5fM2riBI6+Jee6orV1BTSwSEFxKTpwcigSGdM9yt4I5XBLCwtIt7d14ZnWD+4HIOeIgLF8y45kAaVVHAUR63WQlc1XVsbXVfZY4MbNK2Io0AHz09V3Pi3sHhrVxo/OXJ9DS3u0BYXpy1AcCAooPiH7G7XeIk4vWUdowKkz3k1ihVYmgBvVdPb3grbw6Cur2q7H22WymaWZ6chRY8nSg48dVQxAbirtiTcI1B/uOYPLOv1y1aRqeL3cUN632nZkwBKq+VsWVT0CYwSePXNdnbQqAOmFBIHRsbcX/Pv0rstfGkL025jqtw5mikUSabltkxaELE0GPOolQHaEaSvo9SohEjVV17t6HS67DFR5r4n4SH313buOnuI1PC3KdlgpSOaTCCVthaiOKqqYKSvg46qBynLCy/zDJCVNJJ04OIXtv0nV+ksruRCJxz9u2DUY6yt5KQeL6kx89bRwYjCIFQf/Ho8aXPvs88H+z12ajqRI7DDLcEjEoR6l/OipTUR+Ufg9ajRJ/1/XnqdFVE2mglUmEQ6eS4gQFK9V34UhepLT/hk46GnNtGEf0wrSwMhrVMeT/R2GLJ1cvwtjpv3nYW5Bd4NLwxfWUj7ERtTZlcjabKB1pryVd3llqPIfl/f2kUAVNvEqBPzz9se+9u3p63Ry8DgSKGqjPL2UETT6nDXuRjjJJOltRSlBs+ZIZ9Hfm3a+wphmV//MJkFQUGWcbVSlB2+KVqqKcuCt4enK0Jgu3SKqJJan2i6IGkq2L0wdoK2/hBEUb3YfUVFBImx6aOHM8YBjEtkoZlz77HD/79ne0LElVOyotj1PaX4qKckw2SqSJ5xKgAyHqiFNnayoVH319F62+sHgqmHhEKHaT8hZxwXBMPlTYe8q1qkupMFFjaGocTSIi0oZfUUL1pSSRrBSYlWNV25IMVbLHNY0ycbdCAuCpAnl2Mp6KSqPGx4IljtV+a6ksJyygqCtoG84UfaU4lO2MqrKtAxHFUNu6VpzogGnzjE4SdLVQHIyKAxG3cBmIVsxW6ihcPRTY76ejtGrLWRAIcQvUalo12YgJSfZCiihLAJka3nwx4/uK6ug55dqIHRbKNINUU9wIrhpL84X17/3dpezMpxpXDLO6y6avjCgCmI4NA8grPpYvqYy0SHEmU0pLk03SoDqwUvmM609llmpBOHPmLQDAxo0vV46+kjToGhBtT6KtBkUOhpp7N/k/CYTC1UO4cOWiR6VduHIxEiCODToYJxJLH+zSZ5+jY2urr47KtMy+UgC6fsKNMZ9jyEFYu2qN+3sU567ixlrV7aTabO5+VkkA+WRzEKp6xlBjrg1fXE9FNvQSAG++9bbWYycwq9X3RnVcXBrWrlrjec8L+Tb8dtvzxs+ZKsU+qDWvEPbqAORthqiUX1fuuLhhCo8//ri2TLKaO+Lz4xz4Z6X9ajkYmzetx9Hj74Q+p1NqzjbIY6XNtkxTj0npifYU1YHSuKew95VO9L8x4JEOOhGGwNMBkraR3jTxUqOGEahJpZbB4IV5G5q3oKdrN9auWoNlT+RwduQUlj2Rg9ouZl01SVVv/FAOBLRtEXeXitmi1MLW0qkp3A7w7lXqY+fheOl5yyIRcRrldaHpahYGRx0XrlzEhSsXXRDIkJ84OYQLVy6i+efNtXcgYJwSy6CKi1oYEn29cOUidvyqAwDQ238YI++N2KGvkkcd1xks5RocoFrYXJfUDTfUz238JYDwKsTYqqmWVEItPQuBIUnF2lVrsH9vd+UcunJ74kkYJBV/OfMnz+s6tWQViHL5AOcvTyQKBE5puRSQIdep0ppNDJlIF3nutRyXGnlvxGM3dGA4tifJZL8NW8Nk3/JaACObaZrhjIpsRmwgTNlJNaKotbxDGYVEgqKzTrlYik2HT1r197eLyCbiWAKpbYAvHseGWjI5Y6jRcKcx03veDNlUsdYHqScCw7HJmnRnzQHw7dMapVM0aJfMJA9uK5xqMCGTjd1N93RNqo/BbUU20zTj2Jpgk9UZ56RHnaRJEpYEH0MlPSQV6VIZU7nUQ5TrJvHYZJIM+p6Om5WLYh9Kmbiw6yZhJ/ywAOFU8VYqXYkwBu1oT2qk1K0UaNf8JB9no2b4rIU41u0vBh4UTiAWrh6yqs6SqJasJ4YkdsNPQ4nLbqIY/3o4y7os9NWGutAdc1NPPkSiUqUmB9bWy0h0GDzpZ88lqodurox0tVOhsFxTVNc2gj5opXRynEbzupYIftJIbuUBa6XzpvsGzqXhmFZ8B51h/WCUWTVRn1k1T3J/YKxjHur3wGDPYfpazv1YHwARIy6VZKmoC4moxRJ9K0DYqvhGBcv361Y1JW2FJZ3B1U2sKelSkZ6rK7Au8hGVWn1RqwELCY45xU4M/bo1ng05enw08j0+PH0Omzeth7zByjkA90sw61o12Qhn0ITRtghh9+Nn0ulAoL9t3rTe8/4HxjpgBE2mzesn1alL29nE6pz4c6WocRRpqxsgVLVBq5Emo9wrXwJbvWcSpSJti55GAWBxw1RJzCvoXkmVinQ19H0p/2+i+pIoFTXrWevA4mqwnqSi4kDQJJainlQwTKUkkQ6dbhufWqGx/DqVIAhVAULaoYuHD8g7tqECdGfczbWRspkjNgGGwhVHj7+DauxKWXdA2GAp9VBOb2v8H/sQSHEJXjIBAAAAAElFTkSuQmCC", "w": 100, "h": 125}};
const X2 = 2;
// Enemy side. Megatron acts once per round; at half HP Soundwave joins and acts too.
const BOSS = {
name: 'MEGATRON', max: 6200,
open: 'Three Autobots? Optimus sends me scouts and scrap. Kneel, and I may let you rust in peace.',
win: 'This… is not… over… Autobots!',
lose: 'Decepticons! Collect what is left of them.',
p2: 'Soundwave steps out of the dark. "Soundwave: reporting. Autobots: outnumbered."',
megMoves: [
{ n: 'FUSION CANNON', a: 320, b: 390, beam: true, say: 'Hold still. This only hurts for the rest of your life.' },
{ n: 'TYRANT FIST', a: 250, b: 310, say: 'You will learn to kneel.' },
{ n: 'DECEPTICON DECREE', a: 170, b: 220, all: true, say: 'Peace through tyranny!' },
{ n: 'CANNON CHARGE', charge: true, say: 'Do you hear that hum? That is your last turn.' }
],
blast: { n: 'FULL POWER BLAST', a: 440, b: 520, all: true, beam: true, say: 'FULL. POWER.' },
swMoves: [
{ n: 'SONIC PULSE', a: 120, b: 160, all: true, drain: 8, say: 'Frequencies jammed. Your skills: offline.' },
{ n: 'LASERBEAK STRIKE', a: 220, b: 280, say: 'Laserbeak: eject. Operation: annihilate.' },
{ n: 'MIND SCAN', heal: 260, say: 'Megatron. Their plan: predictable. Repairs: transmitted.' }
]
};
const HEROES = [
{ k: 'bb', n: 'BUMBLEBEE', max: 900, ep: 36, label: 'Bumblebee, pixel art', atk: ['STINGER', 150, 200],
skills: [{ n: 'SCOUT', ep: 8, h: 'see his next move · party takes 40% less' }, { n: 'ENERGON SHARE', ep: 14, h: 'heal the party +240' }],
limit: ['STING OPERATION', 760, 900] },
{ k: 'gl', n: 'GRIMLOCK', max: 1300, ep: 30, label: 'Grimlock in robot mode with his energo sword, pixel art', atk: ['ENERGO SWORD', 220, 290],
skills: [{ n: 'ME GRIMLOCK KING', ep: 6, h: 'taunt · single hits go to him' }, { n: 'FIRE BREATH', ep: 16, h: 'big hit · 400–480' }],
limit: ['GRIMLOCK SMASH', 950, 1150] },
{ k: 'hr', n: 'HOT ROD', max: 1000, ep: 34, label: 'Hot Rod, pixel art', atk: ['PHOTON SHOT', 170, 230],
skills: [{ n: 'AFTERBURN', ep: 12, h: 'two hits · 150–190 each' }, { n: 'RALLY', ep: 10, h: 'team +10 EP · +25 limit' }],
limit: ['RODIMUS RISING', 820, 1000] }
];
// stage layout: Megatron left facing right, party staggered on the right like a classic side-view battle
const MEG = { x: 30, foot: 498 };
// Bumblebee and Hot Rod in front, big Grimlock behind the gap between them so every face shows;
// every foot clears the speech box
const SPOT = [{ x: 344, foot: 500 }, { x: 488, foot: 422 }, { x: 636, foot: 504 }];
const SWP = { x: 8, foot: 412 }; // Soundwave stands on the floor behind Megatron
class Component extends DCLogic {
constructor(p) {
super(p);
this.towers = [];
for (let i = 0; i < 16; i++) {
const w = 34 + (i * 29) % 46, h = 90 + (i * 71) % 170;
this.towers.push({ x: i * 56 - 20 + (i * 13) % 20, w, h, clip: i % 3 === 0 ? 'polygon(0 18%, 50% 0, 100% 18%, 100% 100%, 0 100%)' : (i % 3 === 1 ? 'polygon(0 0, 70% 0, 100% 12%, 100% 100%, 0 100%)' : 'none'), far: i % 2 });
}
this.embers = [];
for (let i = 0; i < 20; i++) this.embers.push({ x: (i * 97 + 30) % 840, d: (7 + (i * 7) % 6).toFixed(1), dl: (-(i * 1.7) % 12).toFixed(1) });
this.state = this.fresh();
}
componentWillUnmount() { clearTimeout(this.to); }
R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
pickMeg() { const m = BOSS.megMoves; return m[this.R(0, m.length - 1)]; }
fresh() {
return { boss: BOSS.max, hp: HEROES.map((h) => h.max), ep: HEROES.map((h) => h.ep), lim: [0, 0, 0], active: 0, mode: 'cmd', menu: 'main',
next: this.pickMeg(), scouted: false, shield: false, taunt: false, guard: [false, false, false], charged: false, p2: false, queue: [],
speaker: BOSS.name, speech: BOSS.open, line: 'Megatron blocks the way. Bumblebee, Grimlock and Hot Rod transform and stand ready.',
k: 0, fx: null, win: false, round: 1 };
}
alive(hp) { return [0, 1, 2].filter((i) => hp[i] > 0); }
setMenu(m) { if (this.state.mode === 'cmd') this.setState({ menu: m }); }
// what: 'atk' | 'skill' (j = 0/1) | 'guard' | 'limit'
act(what, j) {
const s = this.state;
if (s.mode !== 'cmd') return;
const i = s.active, H = HEROES[i], R = (a, b) => this.R(a, b);
const hp = s.hp.slice(), ep = s.ep.slice(), lim = s.lim.slice(), guard = s.guard.slice();
let dmg = 0, line = '', name = '', heal = 0, shield = s.shield, taunt = s.taunt, scouted = s.scouted;
const pops = [];
if (what === 'limit') {
if (lim[i] < 100) return;
lim[i] = 0; name = H.limit[0]; dmg = R(H.limit[1], H.limit[2]);
line = { bb: 'Small, fast, everywhere at once.', gl: 'ME GRIMLOCK SMASH!', hr: 'Flames rise, and Hot Rod comes back as Rodimus.' }[H.k] + ' ' + dmg + ' damage.';
} else if (what === 'guard') {
guard[i] = true; ep[i] = Math.min(H.ep, ep[i] + 8); name = 'GUARD'; line = H.n + ' braces and recovers 8 EP.';
} else if (what === 'atk') {
name = H.atk[0]; dmg = R(H.atk[1], H.atk[2]); lim[i] = Math.min(100, lim[i] + 10);
line = H.n + ' uses ' + name + '. ' + dmg + ' damage.';
} else {
const sk = H.skills[j];
if (ep[i] < sk.ep) return;
ep[i] -= sk.ep; name = sk.n; lim[i] = Math.min(100, lim[i] + 6);
if (H.k === 'bb' && j === 0) { shield = true; scouted = true; line = 'Bumblebee scouts ahead: next up is ' + s.next.n + '. The party braces.'; }
if (H.k === 'bb' && j === 1) { heal = 240; line = 'Bumblebee shares his energon. The party recovers 240 HP.'; }
if (H.k === 'gl' && j === 0) { taunt = true; line = '"Me Grimlock king! You hit me Grimlock!"'; }
if (H.k === 'gl' && j === 1) { dmg = R(400, 480); line = 'Grimlock breathes fire. ' + dmg + ' damage.'; }
if (H.k === 'hr' && j === 0) { const a = R(150, 190), b = R(150, 190); dmg = a + b; line = 'Afterburn: two passes, ' + a + ' and ' + b + '.'; pops.push({ x: MEG.x + 70, y: 300, t: String(a), c: '#fff' }); pops.push({ x: MEG.x + 140, y: 270, t: String(b), c: '#fff' }); }
if (H.k === 'hr' && j === 1) { HEROES.forEach((h, q) => { if (hp[q] > 0 && q !== i) { ep[q] = Math.min(h.ep, ep[q] + 10); lim[q] = Math.min(100, lim[q] + 25); } }); line = '"Til all are one!" The team gains EP and limit.'; }
}
if (heal) this.alive(hp).forEach((q) => { hp[q] = Math.min(HEROES[q].max, hp[q] + heal); pops.push({ ...this.popAt(q), t: '+' + heal, c: '#7dff9a' }); });
if (dmg && !pops.length) pops.push({ x: MEG.x + 90, y: 290, t: String(dmg), c: what === 'limit' ? '#ffd27a' : '#fff', s: what === 'limit' ? 30 : 22 });
const boss = Math.max(0, s.boss - dmg);
const st = { hp, ep, lim, guard, shield, taunt, scouted, boss, line, menu: 'main', k: s.k + 1,
fx: { actor: i, onBoss: dmg > 0, pops, banner: name, bannerBg: '#2c46c4', shake: what === 'limit', flash: what === 'limit' ? '#fff' : '' } };
if (boss === 0) { Object.assign(st, { mode: 'over', win: true, speaker: BOSS.name, speech: BOSS.win, line: line + ' MEGATRON IS DEFEATED.' }); this.setState(st); return; }
const nxt = [0, 1, 2].find((q) => q > i && hp[q] > 0);
if (nxt !== undefined) { st.active = nxt; this.setState(st); return; }
const p2 = boss <= BOSS.max / 2;
st.mode = 'enemy'; st.queue = p2 ? ['meg', 'sw'] : ['meg'];
if (p2 && !s.p2) { st.p2 = true; st.speaker = 'SOUNDWAVE'; st.speech = 'Soundwave: reporting. Autobots: outnumbered.'; st.line = BOSS.p2; }
this.setState(st);
this.to = setTimeout(() => this.enemyTurn(), 1400);
}
popAt(q) { const sp = SPOT[q], h = SPR[HEROES[q].k]; return { x: sp.x + h.w * X2 / 2 - 24, y: sp.foot - h.h * X2 - 8 }; }
enemyTurn() {
const s = this.state;
if (s.mode !== 'enemy') return;
const who = s.queue[0], queue = s.queue.slice(1);
const hp = s.hp.slice(), ep = s.ep.slice(), lim = s.lim.slice(), alive = this.alive(hp);
let m, next = s.next, charged = false, boss = s.boss;
if (who === 'meg') { m = s.next; next = m.charge ? BOSS.blast : this.pickMeg(); charged = !!m.charge; }
else m = BOSS.swMoves[this.R(0, BOSS.swMoves.length - 1)];
const mult = (s.shield ? 0.6 : 1) * (s.p2 ? 1.15 : 1);
const pops = [], hitT = [];
const hurt = (q, d) => { if (s.guard[q]) d = Math.round(d / 2); hp[q] = Math.max(0, hp[q] - d); lim[q] = Math.min(100, lim[q] + Math.round(d / 9)); hitT.push(q); pops.push({ ...this.popAt(q), t: String(d), c: '#ff6b8a' }); return d; };
let line, beamT = -1;
if (m.charge) line = 'Megatron charges his fusion cannon. Something big is coming. Guard!';
else if (m.heal) { boss = Math.min(BOSS.max, boss + m.heal); line = 'Soundwave scans the party and patches Megatron up. +' + m.heal + ' HP.'; pops.push({ x: MEG.x + 90, y: 290, t: '+' + m.heal, c: '#7dff9a' }); }
else if (m.all) {
const base = Math.round(this.R(m.a, m.b) * mult);
alive.forEach((q) => { hurt(q, base); if (m.drain) ep[q] = Math.max(0, ep[q] - m.drain); });
line = (who === 'meg' ? 'Megatron' : 'Soundwave') + ' uses ' + m.n + ' on everyone. ' + base + ' damage' + (m.drain ? ', and ' + m.drain + ' EP drained.' : '.');
if (m.beam) beamT = 1;
} else {
const tg = s.taunt && hp[1] > 0 ? 1 : alive[this.R(0, alive.length - 1)];
const d = hurt(tg, Math.round(this.R(m.a, m.b) * mult));
line = (who === 'meg' ? 'Megatron' : 'Soundwave') + ' uses ' + m.n + ' on ' + HEROES[tg].n + '. ' + d + ' damage.';
if (m.beam) beamT = tg;
}
const st = { hp, ep, lim, boss, next, charged, queue, line, speaker: who === 'meg' ? 'MEGATRON' : 'SOUNDWAVE', speech: m.say, k: s.k + 1,
fx: { actor: who, heroHit: hitT, pops, banner: m.n, bannerBg: '#8a1838', shake: !!(m.all || m.beam), beam: beamT, flash: m.beam ? '#b48cff' : '' } };
if (!this.alive(hp).length) { Object.assign(st, { mode: 'over', win: false, speech: BOSS.lose, line: line + ' The Autobots have fallen.' }); this.setState(st); return; }
if (queue.length) { this.setState(st); this.to = setTimeout(() => this.enemyTurn(), 1500); return; }
// new round: guards and shields drop, everyone gets a little EP back
Object.assign(st, { mode: 'cmd', menu: 'main', active: this.alive(hp)[0], guard: [false, false, false], shield: false, taunt: false, scouted: false, round: s.round + 1,
ep: ep.map((v, q) => (hp[q] > 0 ? Math.min(HEROES[q].ep, v + 3) : v)) });
this.setState(st);
}
renderVals() {
const s = this.state, p2 = s.p2, fx = s.fx || {}, kk = s.k % 2, over = s.mode === 'over';
const meg = { ...SPR.meg, w: SPR.meg.w * X2, h: SPR.meg.h * X2, x: MEG.x, y: MEG.foot - SPR.meg.h * X2 };
const sw = { ...SPR.sw, w: SPR.sw.w * X2, h: SPR.sw.h * X2, x: SWP.x, y: SWP.foot - SPR.sw.h * X2 };
const heroes = HEROES.map((h, i) => {
const sp = SPR[h.k], w = sp.w * X2, ht = sp.h * X2, sx = SPOT[i];
const down = s.hp[i] <= 0;
return { src: sp.src, w, h: ht, x: sx.x, y: sx.foot - ht, sx: sx.x + w * 0.1, sy: sx.foot - 10, sw: w * 0.8, label: h.label, delay: (-i * 0.45) + 's',
dx: s.mode === 'cmd' && s.active === i ? -26 : 0, cur: s.mode === 'cmd' && s.active === i ? 'block' : 'none',
fl: down ? 'grayscale(1) brightness(.45)' : (s.guard[i] ? 'drop-shadow(0 0 8px #8de0ff)' : 'drop-shadow(-3px 0 6px ' + (p2 ? '#ff4a6a55' : '#ffd27a44') + ')'),
lunge: fx.actor === i ? 'lungeL' + kk : '', hit: (fx.heroHit || []).includes(i) ? 'hit' + kk : '', foot: sx.foot };
}).sort((a, b) => a.foot - b.foot);
const towers = this.towers.map((w) => ({ ...w, bg: p2 ? (w.far ? '#2a0d24' : '#1a0716') : (w.far ? '#1d2348' : '#121633'), lit: p2 ? '#ff5a7a99' : '#ffd27a88' }));
const embers = this.embers.map((e) => ({ ...e, c: p2 ? '#ff6b8a' : '#ffd27a' }));
const H = HEROES[s.active], i = s.active;
let cmds;
if (s.menu === 'skill') cmds = H.skills.map((sk, j) => ({ n: sk.n + ' · ' + sk.ep + ' EP', h: sk.h, off: s.ep[i] < sk.ep, go: () => this.act('skill', j) })).concat([{ n: '◂ BACK', h: '', off: false, go: () => this.setMenu('main') }]);
else cmds = [
{ n: 'ATTACK', h: H.atk[0] + ' · ' + H.atk[1] + '–' + H.atk[2], off: false, go: () => this.act('atk') },
{ n: 'SKILL ▸', h: H.skills.map((x) => x.n).join(' / '), off: false, go: () => this.setMenu('skill') },
{ n: 'GUARD', h: 'half damage · +8 EP', off: false, go: () => this.act('guard') },
{ n: 'LIMIT', h: H.limit[0] + (s.lim[i] >= 100 ? ' · READY' : ' · ' + s.lim[i] + '%'), off: s.lim[i] < 100, go: () => this.act('limit') }
];
const party = HEROES.map((h, q) => ({ n: h.n, tag: s.guard[q] ? ' ◆' : (q === 1 && s.taunt ? ' ★' : ''), hp: s.hp[q], max: h.max, ep: s.ep[q], emax: h.ep,
hc: s.hp[q] <= 0 ? '#ff6b8a' : (s.hp[q] < h.max / 4 ? '#ffd27a' : '#fff'), lim: s.lim[q], lc: s.lim[q] >= 100 ? 'full' : '',
nc: s.mode === 'cmd' && s.active === q ? '#f3c623' : (s.hp[q] > 0 ? '#fff' : '#7c86c9') }));
// turn order for the rest of this round, then the enemy side
const order = [];
const alive = this.alive(s.hp);
if (s.mode === 'cmd') alive.filter((q) => q >= i).forEach((q) => order.push({ t: HEROES[q].n.slice(0, 3), b: q === i ? '#f3c623' : '#e9e9f2', bg: '#101c6e', c: '#fff' }));
const enemies = s.mode === 'enemy' ? s.queue : (s.boss <= BOSS.max / 2 ? ['meg', 'sw'] : ['meg']);
enemies.forEach((e) => order.push({ t: e === 'meg' ? (s.charged ? 'MEG ⚠' : 'MEG') : 'SW', b: '#ff6b8a', bg: '#4a0c22', c: '#ffd0da' }));
if (!order.length || over) order.length = 0;
const knowNext = s.scouted || s.charged;
const bm = { x: meg.x + meg.w - 14, y: meg.y + meg.h * 0.42, w: 0, h: 34 }; // cannon muzzle
if (fx.beam !== undefined && fx.beam >= 0) bm.w = (fx.beam === 1 && fx.shake && fx.beam !== -1 ? 760 : SPOT[fx.beam].x + 40) - bm.x;
return {
towers, embers, heroes, meg, sw,
sky: p2 ? 'linear-gradient(#0d0414, #34092a 45%, #7a1a3a 58%, #1a0610 58%)' : 'linear-gradient(#070b24, #1f2a6a 40%, #b0603a 58%, #120a14 58%)',
horizon: p2 ? '#ff3a6acc' : '#ffb35aaa', beam: p2 ? '#ff5a7a33' : '#ffd9a03a', floorTop: p2 ? '#3a0c22' : '#2c1c26', grid: p2 ? '#ff4fa340' : '#ffb35a33', pool: p2 ? '#ff3a6a33' : '#ffd27a26',
swOp: p2 ? 1 : 0, swX: p2 ? 0 : -30, swShadow: { x: SWP.x + 30, y: SWP.foot - 10, w: sw.w - 70 }, swCls: fx.actor === 'sw' ? 'hit' + kk : '',
megShadow: { x: meg.x + 20, y: MEG.foot - 14, w: meg.w - 30 },
megCls: fx.actor === 'meg' ? 'lungeR' + kk : '', megHit: fx.onBoss ? 'hit' + kk : '',
megOp: over && s.win ? 0.25 : 1, megFilter: over && s.win ? 'grayscale(1) brightness(.6)' : (p2 ? 'drop-shadow(0 0 10px #ff2a5a88)' : 'drop-shadow(4px 0 8px #ffd27a33)'),
chargeShow: s.charged && !over ? 'block' : 'none', chargeX: meg.x + meg.w - 27, chargeY: meg.y + meg.h * 0.42,
beamShow: bm.w > 0 ? 'block' : 'none', beamCls: 'beam' + kk, bm,
shakeCls: fx.shake ? 'shake' + kk : '', flashCls: fx.flash ? 'flash' + kk : '', flashC: fx.flash || 'transparent',
pops: (fx.pops || []).map((p) => ({ ...p, s: p.s || 20, cls: 'pop' + kk })),
banner: fx.banner || '', bannerCls: fx.banner ? 'banner' + kk : '', bannerBg: fx.bannerBg || '#2c46c4',
speaker: s.speaker, speakerC: s.speaker === 'SOUNDWAVE' ? '#8de0ff' : '#ff8aa6', speech: s.speech, order,
cmds, party, line: s.line, activeName: H.n,
showMain: s.mode === 'cmd' ? 'block' : 'none', showWait: s.mode === 'enemy' ? 'block' : 'none', showOver: over ? 'block' : 'none',
waitText: (s.queue[0] === 'sw' ? 'Soundwave' : 'Megatron') + ' is moving…',
foes: [
{ n: 'MEGATRON', o: 1, bar: 'block', pct: Math.round(s.boss / BOSS.max * 100), c: p2 ? '#ff4fa3' : '#9a8cff', tag: s.boss === 0 ? 'DOWN' : (p2 ? 'ENRAGED' : 'PHASE 1'), tc: p2 ? '#ff8aa6' : '#b9c3ff', sub: s.boss + ' / ' + BOSS.max + (knowNext && !over ? ' · next: ' + s.next.n : '') },
{ n: 'SOUNDWAVE', o: p2 ? 1 : 0.35, bar: 'none', pct: 0, c: '', tag: p2 ? 'SUPPORT' : '???', tc: '#8de0ff', sub: p2 ? "can't be targeted · jams EP, repairs Megatron" : 'joins at half HP' }
],
overShow: over ? 'flex' : 'none', overBg: s.win ? 'radial-gradient(#ffd27a33, #0008)' : 'radial-gradient(#4a0c2266, #000b)',
overText: s.win ? 'VICTORY' : 'GAME OVER', overColor: s.win ? '#f3c623' : '#ff4fa3',
overSub: s.win ? 'Round ' + s.round + ' · Megatron retreats' : 'Megatron wins this round',
overSmall: s.win ? 'The Autobots hold the line.' : 'Try SCOUT and GUARD against the charge.',
reset: () => { clearTimeout(this.to); this.setState(this.fresh()); }
};
}
}

module.exports = { Component, HEROES, BOSS, SPR, X2, MEG, SPOT, SWP };
