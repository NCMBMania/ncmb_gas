# v8エンジン対応版Google Apps Script SDK

## 使い方

スクリプトのIDは `1Z8Lezd0OS6qm9W0EVQxBGx1gztqD14kXPfQxycr_rc2atOfKujiWZe7I` です。

## 初期化

以下はプリフィックスをNCMBとした場合のコードです。

```javascript
const ncmb = NCMB.init('APPLICATION_KEY', 'CLIENT_KEY');
```

## データストアへの保存

```javascript
const test = ncmb.Object('Test');
test
  .set('msg', 'こんにちは、世界！')
  .save();
```

## データストアのデータ更新

```javascript
obj
  .set('memo', new Date())
  .set('ary', ['a', 'b', 'c'])
  .save();
```

## データストアのデータ削除

```javascript
obj.destroy();
```

## データストアの検索

```javascript
const query = ncmb.Query(className);
const ary = query
  .greaterThan('number', 4)
  .equalTo('msg', 'Hello')
  .fetchAll();
```

## License

MIT.
