<footer class="site-footer">
  <p>&copy; <?= date('Y') ?> <?= $escape($app_name) ?></p>
  <a href="mailto:<?= $escape($support_email) ?>"><?= $escape($support_email) ?></a>
</footer>
<script>
window.APP_BASE_PATH = <?= json_encode($app_base, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
window.APP_FORM_STATE = <?= json_encode($app_form_state ?? [], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
window.addEventListener('local-auth-state', function (event) {
  var links = document.getElementById('site-navigation-links');
  if (links) links.hidden = !event.detail.authenticated;
});
</script>
<script type="module" crossorigin src="<?= $escape($js_asset) ?>"></script>
</body>
</html>